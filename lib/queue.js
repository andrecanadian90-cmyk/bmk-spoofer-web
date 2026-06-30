// Simple in-memory priority queue for spoof operations
const activeJobs = new Set();
const pendingJobs = [];
const MAX_CONCURRENT = 2; // Keep concurrent requests safe for Roblox rate limits

const getRankWeight = (role = 'user', totalTopUp = 0) => {
  const normRole = (role || '').toLowerCase().replace(/[- ]/g, '_');
  if (normRole === 'admin') return 4;               // ADMIN
  if (normRole === 'top_spender') return 3;         // TOP SPENDER
  if (totalTopUp >= 500) return 2;              // EXCLUSIVE
  if (totalTopUp >= 50) return 1;               // PREMIUM
  return 0;                                     // BASIC
};

const processNext = async () => {
  if (activeJobs.size >= MAX_CONCURRENT || pendingJobs.length === 0) {
    return;
  }

  // Sort: highest priority rank weight first, then oldest timestamp first
  pendingJobs.sort((a, b) => {
    if (b.weight !== a.weight) {
      return b.weight - a.weight;
    }
    return a.timestamp - b.timestamp;
  });

  const job = pendingJobs.shift();
  activeJobs.add(job.id);

  try {
    const result = await job.task();
    job.resolve(result);
  } catch (err) {
    job.reject(err);
  } finally {
    activeJobs.delete(job.id);
    // Process next item asynchronously
    processNext();
  }
};

export const enqueueSpoof = (role, totalTopUp, task) => {
  return new Promise((resolve, reject) => {
    const weight = getRankWeight(role, totalTopUp);
    const job = {
      id: Math.random().toString(36).substring(2, 9) + '-' + Date.now(),
      weight,
      task,
      timestamp: Date.now(),
      resolve,
      reject
    };
    pendingJobs.push(job);
    processNext();
  });
};
