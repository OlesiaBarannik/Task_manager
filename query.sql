SELECT DISTINCT t.status
FROM tasks t
ORDER BY t.status ASC;

SELECT p.name AS project_name, COUNT(t.id) as task_count
FROM projects p
LEFT JOIN tasks t ON p.id =  t.project_id
GROUP BY p.id
ORDER BY task_count DESC

SELECT p.name AS project_name, COUNT(t.id) as task_count
FROM projects p
LEFT JOIN tasks t ON p.id =  t.project_id
GROUP BY p.id
ORDER BY p.name

SELECT p.name AS project_name, t.name AS task_name
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
WHERE p.name LIKE 'N%'

SELECT p.name AS project_name, COUNT(t.id) as task_count
FROM projects p
LEFT JOIN tasks t ON p.id =  t.project_id
WHERE p.name LIKE '_%a%_'
GROUP BY p.id

SELECT t.name
FROM tasks t
GROUP BY t.name
HAVING COUNT(t.name) > 1
ORDER BY t.name ASC;

SELECT t.name, t.status, COUNT(*) AS matches_count
FROM tasks t
INNER JOIN projects p ON t.project_id = p.id
WHERE p.name = 'Delivery'
GROUP BY t.name, t.status
HAVING  COUNT(*) > 1
ORDER BY matches_count DESC;

SELECT p.name AS project_name, COUNT(t.id) AS completed_task
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
WHERE t.status = 'completed'
GROUP BY p.id
HAVING COUNT(t.id) > 10
ORDER BY p.id