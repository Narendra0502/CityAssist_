

const nodemailer = require('nodemailer');

class EmailService {    static async createTransporter() {
        try {
            console.log('Creating Gmail transporter...');
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_APP_PASSWORD
                }
            });

            // Verify transporter
            await transporter.verify();
            console.log('✅ SMTP connection established');
            return transporter;
        } catch (error) {
            console.error('❌ Transporter creation failed:', error);
            throw error;
        }
    }
    static async sendStatusUpdateEmail(adminEmail, issueDetails) {
        try {
            console.log('📧 Sending email with details:', {
                admin: adminEmail,
                issue: {
                    title: issueDetails?.title,
                    status: issueDetails?.status,
                    email: issueDetails?.email
                }
            });

            if (!issueDetails?.email) {
                throw new Error('Invalid issue details: missing email');
            }
    
            const transporter = await this.createTransporter();
            console.log('✅ Transporter created successfully');
    
            const emailPromise = new Promise(async (resolve, reject) => {
                try {
                    const info = await transporter.sendMail({
                        from: `CityAssist Admin <${adminEmail}>`,
                        to: issueDetails.email,
                        subject: `Issue Status Update - ${issueDetails.title}`,
                        html: this.getStatusUpdateTemplate(issueDetails)
                    });
     
                    console.log('\n📧 Email Preview:');
                    console.log('=====================================');
                    console.log('Message ID:', info.messageId);
                    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
                    console.log('=====================================\n');
                    
                    resolve(info);
                } catch (error) {
                    console.error('❌ Email sending failed in promise:', error);
                    reject(error);
                }
            });
    
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Email timeout after 15s')), 15000);
            });

            const info = await Promise.race([emailPromise, timeoutPromise]);
            return { 
                success: true, 
                messageId: info.messageId,
                previewUrl: nodemailer.getTestMessageUrl(info)
            };
    
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            return { 
                success: false, 
                error: error.message,
                stack: error.stack
            };
        }
    }
    
         

    static getStatusUpdateTemplate(issueDetails) {
        return `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Issue Status Update</h2>
                <p>Dear ${issueDetails.name},</p>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
                    <p><strong>Issue Title:</strong> ${issueDetails.title}</p>
                    <p><strong>Department:</strong> ${issueDetails.department}</p>
                    <p><strong>City:</strong> ${issueDetails.city}</p>
                    <p><strong>Status:</strong> <span style="color: ${this.getStatusColor(issueDetails.status)}">${issueDetails.status}</span></p>
                    ${issueDetails.reason ? `<p><strong>Reason:</strong> ${issueDetails.reason}</p>` : ''}
                    ${issueDetails.remark ? `<p><strong>Remarks:</strong> ${issueDetails.remark}</p>` : ''}
                </div>
                <p style="color: #7f8c8d; margin-top: 20px;">Thank you for using CityAssist!</p>
            </div>
        `;
    }

    static getStatusColor(status) {
        const colors = {
            'Pending': '#ffc107',
            'Accepted': '#28a745',
            'Rejected': '#dc3545',
            'Hold': '#6c757d',
            'Completed': '#17a2b8'
        };
        return colors[status] || '#6c757d';
    }
}
module.exports = EmailService;
