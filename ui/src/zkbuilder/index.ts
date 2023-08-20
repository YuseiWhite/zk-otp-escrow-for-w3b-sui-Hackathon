
export const postGenerateProof = async (data: { secret_code: number[], public_hash: string }) => {
  const response = await fetch('http://localhost:8080/generate-proof', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  });

  if (!response.ok) {
      throw new Error('Network response was not ok');
  }

  return await response.json();
};
