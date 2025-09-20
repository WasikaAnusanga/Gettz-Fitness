import client from './client';

export async function getAllTrainers() {
  const { data } = await client.get('/api/trainer/viewTrainers');
  return data;
}

export async function removeTrainer(trainerId) {
  const token = localStorage.getItem("token");
  return client.delete(`/api/trainer/deleteTrainer/${trainerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
