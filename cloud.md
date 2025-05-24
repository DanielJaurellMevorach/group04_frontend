
---
# Azure Hosting Cost Summary
This document summarizes the expected costs for core Azure components of your application, broken down by user tier (1,000 / 10,000 / 100,000 users). All cost explanations are included. Calculations assume **50 web service requests per user/month, each using 1 MB bandwidth** (Users × 50 × 1 MB = Total Bandwidth per month). **Storage, function, Cosmos DB, and (optionally) Redis Cache** are also calculated.
---
## 1. Web Service (App Service)
| Users | Bandwidth/Month | Recommended Tier | Max Users by Bandwidth | Cost/Month | Comments |
|--------|-----------------|-------------------------|-----------------------|--------------|--------------------------------------------------------|
| 1,000 | 50 GB | Standard (S1) | ~2,000 | ~$75 | Handles 1,000 users. 100GB included. |
| 10,000 | 500 GB | Premium V2 (P1v2) | ~35,000 | ~$145 | Single instance sufficient; large bandwidth buffer. |
| 100,000| 5,000 GB (5 TB) | Premium V2 (P1v2) ×3 | ~105,000 (in 3 inst.) | ~$435 | 3 × P1v2 needed; covers bandwidth for 100k users. |
**Cost Calculation Explanation:**
- Bandwidth usage is **Users × 50 × 1 MB**
- Choose next tier if bandwidth/user limit exceeded
- If > bandwidth, scale out with more instances
---
## 2. Cosmos DB
### Tier Options:
- **Provisioned Throughput:** Fixed RU/s, pay for capacity, best for steady workloads.
- **Autoscale:** RU/s auto-scales up to a max, billed at max used.
- **Serverless:** Pay per operation, good for low/spiky usage.
**Explanation:**
- For 1,000–100,000 steady users, use **Provisioned/Autoscale** (predictable cost)
- Price varies, but for planning purposes (2025 rates):
- **~$25/mo per 400 RU/s** (basic region)
- Example: 10,000 users might require ~2,000 RU/s = ~$125/mo
- Heavy Redis usage can drop RU requirements (explained later)
---
## 3. Storage Account (Blob, Hot Tier Example)
**Assumptions:**
- 1 image per user, avg 0.5 MB
- Each image read 5 times per month
|Users | Storage | Reads/mo | Storage Cost* | Read Cost* | Total Storage Cost* |
|--------|---------|----------|---------------|------------|---------------------|
| 1,000 | 0.5 GB | 5,000 | ~$0.01 | ~$0.002 | **~$0.01** |
| 10,000 | 5 GB | 50,000 | ~$0.09 | ~$0.02 | **~$0.11** |
| 100,000| 50 GB | 500,000 | ~$0.92 | ~$0.20 | **~$1.12** |
\*Hot tier: ~$0.0184/GB/mo, Read: ~$0.004/10,000 ops
---
## 4. Azure Functions (Consumption Plan)
**Assumptions:**
- 14 functions, 30 invocations/user/mo
- Each invocation: 200 ms, 128 MB (0.0256 GB-sec)
- 1 million executions free/mo
|Users | Invoc/mo | GB-s | Execution Cost* | Invoc. Cost* | Total Function Cost* |
|--------|----------|----------|-----------------|--------------|---------------------|
| 1,000 | 30,000 | 768 | $0.012 | Free | **~$0.01** |
| 10,000 | 300,000 | 7,680 | $0.12 | Free | **~$0.12** |
|100,000 | 3,000,000| 76,800 | $1.23 | $0.40 | **~$1.63** |
\*Execution: $0.000016/GB-sec, Invocations: $0.20/million after 1M free
---
## 5. Azure Redis Cache (Optional)
**Purpose:**
Caching to reduce database load & speed up reads (user data, art meta, etc.).
**Assumptions:**
- 20 cache ops/user/mo (~90% reads)
- Total cache: Cart (1 KB), Likes (1 KB), Profile (0.5 KB), Art meta (1 KB/user)
|Users | Cache Required | Redis Tier | Redis Cost/mo |
|--------|---------------|------------|--------------|
|1,000 | ~3.5 MB | Basic C0 | ~$17 |
|10,000 | ~35 MB | Basic C0 | ~$17 |
|100,000 | ~350 MB | Basic C1 | ~$41 |
> **When using Redis, Cosmos DB can be downsized, saving $20–600+/mo!**
---
# **Total Monthly Cost Estimates (By User Tier)**
### Without Redis
| Users | Web Service | Cosmos DB* | Storage | Functions | **Total/mo** |
|---------|-------------|------------|---------|-----------|---------------------|
| 1,000 | $75 | ~$25 | $0.01 | $0.01 | **~$100** |
| 10,000 | $145 | ~$125 | $0.11 | $0.12 | **~$270** |
|100,000 | $435 | ~$625 | $1.12 | $1.63 | **~$1,062** |
\*Cosmos DB cost depends on workload (provisioned as above)
---
### With Redis (and Reduced Cosmos DB/Function Load)
- Redis absorbs frequent/cached reads, so Cosmos DB and Function usage drops by ~80–90%.
- Use minimum Cosmos DB (just for writes/uncached). Assume 20% of above DB cost.
| Users | Web Service | Cosmos DB (20%)| Storage | Functions (20%) | Redis | **Total/mo** |
|---------|-------------|----------------|---------|-----------------|-------|--------------|
| 1,000 | $75 | ~$5 | $0.01 | $0.002 | $17 | **~$97** |
| 10,000 | $145 | ~$25 | $0.11 | $0.024 | $17 | **~$187** |
|100,000 | $435 | ~$125 | $1.12 | $0.33 | $41 | **~$602** |
---
## **Cost Calculation Highlights**
- **Web Service** costs are driven by bandwidth/scale, jumping per additional instance needed.
- **Cosmos DB** can be dramatically downsized with Redis, since most reads come from cache.
- **Blob Storage** is minimal due to small image sizes and low read rates.
- **Azure Functions** are cheapest at low invocation rates, and many scenarios are covered by free quotas.
- **Redis** adds ~$17/mo up to 10,000 users; at 100k, a larger tier ($41) is required, but huge DB savings result.
---
## **Summary Table**
| Users | Without Redis | With Redis (DB+Func Savings) |
|---------|---------------|------------------------------|
| 1,000 | ~$100 | **~$97** |
| 10,000 | ~$270 | **~$187** |
|100,000 | ~$1,062 | **~$602** |
---
### Redis summary:
- Redis cost is more than offset by Cosmos DB savings for all user tiers.
- Improves speed and scalability—**recommended for production at 10,000+ users**.
- You still need to pay minimum for DB/write workloads.
---
**Let me know if you want per-component sub-totals, higher-traffic assumptions, or further breakdowns!**

