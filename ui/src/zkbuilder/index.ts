
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

// 使用例:
const data = {
  secret_code: [123, 456, 789], // これはサンプルデータです。実際のデータに置き換えてください。
  public_hash: "your_public_hash_here" // これもサンプルデータです。
};

// postGenerateProof(data)
//   .then(result => {
//       console.log(result);
//   })
//   .catch(error => {
//       console.error('There was a problem with the fetch operation:', error);
//   });
