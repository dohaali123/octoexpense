import { Resend } from "resend";
/*re_dY4V6sWR_Hgexf6SFMNHzwS7i4jCdgQ7W*/
const resend = new Resend('re_jf2xHsnL_539fYshAtHrK3GhEw8skwNUP');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userEmail, photo, country, costCentre, expenseType, reimbursementNeeded, comment } = req.body;

    let recipients = [];
    if (country === 'Australia') {
      recipients.push('accounts@au.dresden.vision');
    } 
    if (country === 'Canada') {
      recipients.push('accounts@ca.dresden.vision');
    } 
    if (country === 'Canada and Australia') {
      recipients.push('accounts@ca.dresden.vision', 'accounts@au.dresden.vision')
    }
    recipients.push(userEmail);

    // Filter out undefined or empty emails
    const validRecipients = recipients.filter(email => email && typeof email === 'string');

    try {
      // Convert recipients array to a comma-separated string
      const recipientsString = validRecipients.map(email => email.trim()).join(',');

      // Send email via Resend API
      const response = await resend.emails.send({
        to: recipientsString, // Pass the recipients as a string
        from: "dohaahmed23@dresden.io",
        subject: 'Expense Form Submission',
        attachments: [
          {
          content: photo, // Ensure `photo` is a base64 string
          filename: 'receipt.jpg', // Specify a filename
          },
        ],
        html: `
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Cost Centre:</strong> ${costCentre}</p>
          <p><strong>Expense Type:</strong> ${expenseType}</p>
          <p><strong>Reimbursement Needed:</strong> ${reimbursementNeeded}</p>
          <p><strong>Comment:</strong> ${comment}</p>
        `,
      });

      // Log the full response to inspect
      console.log('Full Response:', response);

      // If the response contains an ID, log it
      if (response.id) {
        console.log('Email sent, response ID:', response.id);
      }

      // Return success response
      res.status(200).json({ success: true, message: 'Email sent successfully!', id: response.id });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, error: 'Email submission failed', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

