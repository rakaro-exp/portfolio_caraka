-- Query to calculate conversion rate
SELECT 
    COUNT(CASE WHEN converted = 1 THEN 1 END) * 100.0 / COUNT(*) as conversion_rate
FROM leads;
