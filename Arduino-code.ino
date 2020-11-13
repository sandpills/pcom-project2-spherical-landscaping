#include <Arduino_LSM6DS3.h>
#include <MadgwickAHRS.h>

const int led = 2;

int brightness = 0;
int fadeAmount = 4;    // smaller number is slower fade

int redPin= 10;
int greenPin = 11;
int bluePin = 12;
int r = 0;
int g = 0;
int b = 0;

// initialize a Madgwick filter:
Madgwick filter;
// sensor's sample rate is fixed at 104 Hz:
const float sensorRate = 104.00;

void setup() {
  Serial.begin(9600);
  // attempt to start the IMU:
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU");
    // stop here if you can't access the IMU:
    while (true);
  }
  // start the filter to run at the sample rate:
  filter.begin(sensorRate);
  pinMode(led, OUTPUT);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(9, OUTPUT);
}

void loop() {
  setColor(r, g, 0); 
  // values for acceleration & rotation:
  float xAcc, yAcc, zAcc;
  float xGyro, yGyro, zGyro;
  
  // values for orientation:
  float roll, pitch, heading;
  // check if the IMU is ready to read:
  if (IMU.accelerationAvailable() &&
      IMU.gyroscopeAvailable()) {
    // read accelerometer & gyrometer:
    IMU.readAcceleration(xAcc, yAcc, zAcc);
    IMU.readGyroscope(xGyro, yGyro, zGyro);
   // update the filter, which computes orientation:
    filter.updateIMU(xGyro, yGyro, zGyro, xAcc, yAcc, zAcc);
    roll = filter.getRoll();
    pitch = filter.getPitch();
    heading = filter.getYaw();

//lights
     int sensorValue = analogRead(A0)/816;
     int fadeAmount = sensorValue + 2;
  // blue led fade
     // change the brightness for next time through the loop:
     brightness = brightness + fadeAmount;  
     // when it's maximum brightness, reverse fade
     if (brightness <= 0 || brightness >= 255) {
       fadeAmount = -fadeAmount;
     }
  // control behavior
     if (roll < 4 && roll > - 4
     && yAcc > -0.1 && yAcc < 0.1 
     && zAcc < 1.1 && zAcc > 0.1 ) {  
     analogWrite(led, brightness);  
       b = 0;
       g = 0;
       r = 0;
     } else {                                                                                                                                                
     analogWrite(led, 0);
        if (roll >= 4) {
        r = map(roll, 1.2, 180, 100, 50);
        b = map(roll, 1.2, 180, 0, 255);
        g = map(roll, 1.2, 180, 60, 0);
       } else if (roll <= -4) {
        r = map(roll, -1.2, -180, 100, 255);
        b = map(roll, -1.2, -180, 0, 200);
        g = map(roll, -1.2, -180, 60, 255);
        }
     setColor(r, g, b);
     }
     delay(1);  

    Serial.print(roll);
    Serial.print(",");
    Serial.print(yAcc);
    Serial.print(",");
    Serial.println(zAcc);
  }
}

void setColor (int redValue, int greenValue, int blueValue) {
     analogWrite(redPin, 255-redValue);
     analogWrite(greenPin, 255-greenValue);
     analogWrite(bluePin, 255-blueValue);
}
