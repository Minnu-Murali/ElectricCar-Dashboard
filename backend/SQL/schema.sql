CREATE DATABASE IF NOT EXISTS bmw_electric_cars;
USE bmw_electric_cars;

CREATE TABLE IF NOT EXISTS cars (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Brand VARCHAR(100),
  Model VARCHAR(200),
  AccelSec DECIMAL(5,2),
  TopSpeed_KmH INT,
  Range_Km INT,
  Efficiency_WhKm INT,
  FastCharge_KmH INT,
  RapidCharge VARCHAR(10),
  PowerTrain VARCHAR(50),
  PlugType VARCHAR(50),
  BodyStyle VARCHAR(50),
  Segment VARCHAR(10),
  Seats INT,
  PriceEuro INT,
  Date DATE
);
