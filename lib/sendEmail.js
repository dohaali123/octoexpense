export async function sendEmail(data) {
  // Check if there's a photo file and convert it to base64 if necessary
  if (data.photo instanceof File) {
    data.photo = await convertToBase64(data.photo);
  }

  try {
    const response = await fetch('../api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email');
    }

    return result;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
}

// Utility function to convert file to base64
async function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the metadata prefix
    reader.onerror = (error) => reject(error);
  });
}
