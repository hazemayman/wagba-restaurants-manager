import logo from './logo.svg';
import './App.css';
import Order from './components/Order'
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, Database} from "firebase/database";
import React  , {useState , useEffect} from 'react'
import { Dropdown } from 'reactjs-dropdown-component';
// import Alert from '@mui/joy/Alert'; 
const firebaseConfig = {
  apiKey: "AIzaSyBnmGmDeACPvqLPKroWLCtjuKqAYiHfiuE",
  authDomain: "wagba-17f4c.firebaseapp.com",
  databaseURL: "https://wagba-17f4c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "wagba-17f4c",
  storageBucket: "wagba-17f4c.appspot.com",
  messagingSenderId: "945499188283",
  appId: "1:945499188283:web:e4948f9e87e4a2b710001e",
  databaseURL: "https://wagba-17f4c-default-rtdb.europe-west1.firebasedatabase.app/"
};

let condition = true;
let firstRestaurantReload = true;
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);


function App() {

  const [restaurantsOrderData , setrestaurantsOrderData] = useState({})
  const [restaurant, setRestaurant] = useState("none")
  const [restaurantNameList , setRestaurantNameList] = useState([])
  const [orders , setOrders] = useState({})


  const updateDatabaseUser = (ID , date , DeliveryFee , DeliveryLocation , DeliveryTime,
    Food , Status ,Total ,User , rest ) =>{
    set(ref(database, '/ActiveOrders/' + User.split('@')[0] + '/' + ID ),{
      DeliveryLocation ,
      DeliveryTime ,
      Food,
      Status,
      Total ,
      User,
      DeliveryFee,
      Date : date,
      restaurant})
    .then(() => {
      // Data saved successfully!
      console.log("done")
    })
    .catch((error) => {
      // The write failed...
      console.log("error user update")
    });
  }

  const updateDatabase =  (ID , date , DeliveryFee , DeliveryLocation , DeliveryTime,
    Food , Status ,Total ,User , rest) =>{
      console.log(date)
    let orderDate = new Date(date);
    console.log(orderDate)
    let currentDate = new Date();
    console.log(currentDate)
    if(currentDate.getDate() != orderDate.getDate()){
      alert("the order due date exceded but continue for testing purposes")
    }else{
      if(DeliveryTime.split(":")[0] == 12){
        orderDate.setHours(10)
        orderDate.setMinutes(30)
      }else if(DeliveryTime.split(":")[0] == 3){
        orderDate.setHours(1)
        orderDate.setMinutes(30)
      }
      console.log(orderDate)
      console.log(currentDate)
      if(currentDate > orderDate){
        alert("the order due date exceded but continue for testing purposes")
      }
    }
    set(ref(database, '/RestaurantOrders/' + restaurant + '/' + ID),  {
      DeliveryLocation ,
      DeliveryTime ,
      Food,
      Status,
      Total ,
      User,
      DeliveryFee,
      Date : date,
      restaurant})
    .then(() => {
      // Data saved successfully!
      updateDatabaseUser(ID , date , DeliveryFee , DeliveryLocation , DeliveryTime,
        Food , Status ,Total ,User , rest );
    })
    .catch((error) => {
      // The write failed...
      console.log("error restaurant update")
    });
  }
  const onRestaurantChange = (item , name)=>{
    console.log(item , " " ,name);
    setRestaurant(item['value'])

  }
  useEffect(()=>{
    if(condition){  
      const starCountRef = ref(database,'RestaurantOrders');
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setrestaurantsOrderData(data);
        if(firstRestaurantReload){
          for (let key in data){
            setRestaurant(key)
            firstRestaurantReload = false;
            break;
          }
        }
      });
      condition = false
    }
  } , [])


  useEffect(()=>{
    if(!condition && restaurant != "none"){
      setOrders(restaurantsOrderData[restaurant])
      let listOfRestaurants = []
      for (let key in restaurantsOrderData){
        listOfRestaurants.push({'label' : key , 'value' : key})
      }
      setRestaurantNameList(listOfRestaurants);

    }
  } , [restaurantsOrderData , restaurant])
  // console.log(orders)
  const viewOrders = [];
  for (let key in orders){
    viewOrders.push(
      <Order  
        key = {key}
        ID = {key}
        DeliveryLocation = {orders[key]['DeliveryLocation']}
        DeliveryTime = {orders[key]['DeliveryTime']}
        Food = {orders[key]['Food']}
        Status = {orders[key]['Status']}
        Total = {orders[key]['Total']}
        User = {orders[key]['User']}
        DeliveryFee = {orders[key]['DeliveryFee']}
        Date = {orders[key]['Date']}
        updateDatabase = {updateDatabase}
        restaurant = {orders[key]['restaurant']}
      />
    )
  }
  return (
    
    <div className='main-container'>
      {/* <Alert variant="solid">This is an Alert using the solid variant.</Alert> */}
      <div className='navbar-container'>
      <Dropdown
        name="Restaurant"
        title="restaurant"
        className="menu"
        searchable={["Search for restaurant", "No matching restaurant"]}
        list={restaurantNameList}
        onChange={onRestaurantChange}
      />
      </div>
      <div className='orders-container'>
       {viewOrders}
      </div>
    </div>
  );
}

export default App;
