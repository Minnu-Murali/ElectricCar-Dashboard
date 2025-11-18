LOAD DATA INFILE '/path/to/BMW_Aptitude_Test_Test_Data_ElectricCarData.csv'
INTO TABLE cars
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(Brand, Model, AccelSec, TopSpeed_KmH, Range_Km,
 Efficiency_WhKm, FastCharge_KmH, RapidCharge, PowerTrain,
 PlugType, BodyStyle, Segment, Seats, PriceEuro, @DateStr)
SET Date = STR_TO_DATE(@DateStr, '%m/%d/%y');
