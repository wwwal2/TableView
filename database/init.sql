CREATE TABLE IF NOT EXISTS app_state (
  id INT PRIMARY KEY,
  count_value INT NOT NULL
);

INSERT INTO app_state (id, count_value)
VALUES (1, 111)
ON CONFLICT (id) DO NOTHING;