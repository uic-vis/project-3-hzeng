# Chicago Taxi Trips Interactive Visual Data Exploration Webpage Based On Javascript And HTML

### Author: Yingyi Luo   yluo52@uic.edu    Haoxuan Zeng   hzeng20@uic.edu
## Background 
This is a third project in class **CS424** - Visualization & Visual Analytics (Fall 2022)[Course project webpage](https://fmiranda.me/courses/cs424-fall-2022/project-3/)
The goal of this project is to build a complete web-based visualization system leveraging outcomes from Project 1 and Project 2. We will use JavaScript and D3 to visualize and interactively analyze a dataset. Your visualization should be hosted on a publicly available website and you can use any web hosting service you prefer
## Here is the link for our project
>[Chicago Taxi Web Page](https://hzeng98.github.io/)

# **1 Interface**

| INDEX | Description |
| :---: | :----: |
| <div align=center><img width="7000" height="400" src="https://github.com/uic-vis/project-3-hzeng/blob/main/Pictures/1.png"/></div> | The basic interface of our website is as shown, click on the top of the page to go to the map, summer chart, winter chart page and questions page. Authors information and data are displayed at the bottom of the page |



| MAP | SUMMER | WINTER |
| :----------: | :-----------: | :-----------: |
| Click on different blocks in the MAP page to highlight and display data in bar chart with details. | Use boxes to view and filter data of interest in summer chart, see the relationship between taxi fee and distance, as well as the relationship with tip in two interest areas in Chicago summer | Use boxes to view and filter data of interest in winter chart, see the relationship between taxi fee and distance in two interest areas in Chicago winter, and the relationship between tips and miles  |








# **2 Dataset Description**

For the map, we used the taxi trips in 2021 dataset from Chicago Data Portal. We also cleaned the invalid value in the dataset, and we counted the number of trips by each community area in Chicago. We also used the boundary of Chicago by community area dataset, and we merged two dataset by using python. We generate a js file to apply on our website.
The dataset containing the Trips information had the following attributes:

 1. 'Trip_Start_Timestamp' :  datetime for the start time of the trip.
 2. 'Trip_End_Timestamp' :  datetime for the end time of the trip.
 3. 'Trip_Miles' : number of miles the trips took
 4. 'Pickup_Community_Area' : community area for the pick up location
 5. 'Tips' : number of tips the customer paid
 6. 'Trip_Total' : number of total  cost for the trip


For the graphs, we separated the taxi trips dataset by month, and we collected the data in June as Summer dataset and the data in December as Winter dataset. Since our dataset is too large for our graphs, we used the random sample method to get 10,000 data of trips for each dataset.
The dataset containing the Trips in each Community Area information had the following attributes:

 1. 'community' : name of this community area in Chicago
 2. 'area_numbe' : number of this community area in Chicago
 3. 'count' : number of trips started in this community area in Chicago
 4. 'geometry' : geometry information of this community area in Chicago



# **3. Questions**

In order to figure out what is essentially about the Taxi order amount, total trips price and even the Tips the customers offer, which is our interesting. we come up with 5 questions
* Where is the most famous area for Chicago Taxi trips?
* How do seasons change the number of Taxi?
* How do trip miles change the total price?
* How do the miles and total price change the total number of taxi?
* How do the miles，seasons and total price change the taxi count in different places?

# Interactive Visual Data Exploration

## Visualization MAP
<div align=center><img width="1000" height="400" src="https://github.com/uic-vis/project-3-hzeng/blob/main/Pictures/2.png"/></div>

### Questions
* Where is the most famous area for Chicago Taxi trips?

Firstly, we used a dataset of Chicago boundaries by community area. Aggregate by 'Pickup_Community_Area' : community area for the pick up location. The darker the red color in the map, the more people are taking cabs in that area, and the number of people is displayed in the upper right corner of the map, and the bar chart, which is a count of the number of people, is also highlighted. The most obvious ones are the Loop area and the O'Hare Airport area, so we selected these two areas as areas of interest for the next step of our study.

## Visualization interactive chart SUMMER & WINTER
### Questions
* How do seasons change the number of Taxi?
* How do trip miles change the total price?
* How do the miles and total price change the total number of taxi?
* How do the miles，seasons and total price change the taxi count in different places?



We chose the **Quantity Types** and we can see that distance and tips are also basically positively correlated, but the distribution is more dispersed than before
Passengers at airports generally travel longer and more expensive distances than those in loops. The distance to the airport is mainly concentrated between 10-25miles for passengers, and the price is between 40-70. Passengers going to the loop are mainly concentrated within 10miles, and the price is about 20.
We come up with some conlcusion. In winter time, the number of orders less than 10miles at the airport will decrease, but the number of orders at the loop will increase, so it is recommended that drivers who like to run short distances try to pick up orders at the loop in winter. The number of tips at the airport in summer will be more than in winter, probably because there are more tourists visiting Chicago in summer, so it is recommended that drivers who like to run long distances pick up orders at the airport in summer.


<div align=center><img width="500" height="200" src="https://github.com/uic-vis/project-3-hzeng/blob/main/Pictures/3.png"/></div>



<div align=center><img width="500" height="200" src="https://github.com/uic-vis/project-3-hzeng/blob/main/Pictures/5.png"/></div>

Passengers at airports generally travel longer and more expensive distances than those in loops. The distance to the airport is mainly concentrated between 10-25miles for passengers, and the price is between 40-70. Passengers going to the loop are mainly concentrated within 10miles, and the price is about 20.
 
  We come up with some conlcusion. In winter time, the number of orders less than 10miles at the airport will decrease, but the number of orders at the loop will increase, so it is recommended that drivers who like to run short distances try to pick up orders at the loop in winter. The number of tips at the airport in summer will be more than in winter, probably because there are more tourists visiting Chicago in summer, so it is recommended that drivers who like to run long distances pick up orders at the airport in summer.
  
  <div align=center><img width="500" height="200" src="https://github.com/uic-vis/project-3-hzeng/blob/main/Pictures/4.png"/></div>
  <div align=center><img width="500" height="200" src="https://github.com/uic-vis/project-3-hzeng/blob/main/Pictures/6.png"/></div>
  
**Finally we got conclusion as follows**
> 1. Drivers who like to run short distances try to pick up orders at the loop in winter.
> 2. Drivers who like to run long distance pick up orders at the airport in summer.
> 3. Drivers are advised to pick up more passengers at the airport to increase their income by getting more tips.



## References

| Name | Web |
| ------ | ------ |
| Choropleth Map |https://datavizcatalogue.com/methods/choropleth.html|
| GitHub |https://github.com/ |
| Leaflet Draw Library Links |https://cdnjs.com/libraries/leaflet.draw |
| Web Master | https://sc.chinaz.com/moban/ |
| DILLINGER |https://dillinger.io/ |
