import React , {useState , useEffect} from "react";
import './Order.css'
import { Dropdown } from 'reactjs-dropdown-component';
const Order = (props) =>{

    const { ID,
            DeliveryLocation ,
            DeliveryTime ,
            Food,
            Status,
            Total ,
            User,
            DeliveryFee,
            Date,
            updateDatabase,
            restaurant} = props;

    console.log(ID)

    const foods = []
    for (let i = 0; i< Food.length; i++){
        foods.push(
            <div className="food-item">
                <p>{Food[i]['foodName']}</p>
                <div className="order-data-inner">
                    <p>{Food[i]['price']} EGP</p>
                    <p>x{Food[i]['quantity']}</p>
                </div>
            </div>
        )
    }

    const StatusList = [];
    if(Status == "Pending"){
        StatusList.push(
           {
            'label' : 'Taken',
            'value' : 'Taken'
           }
        )
        StatusList.push(
            {
                'label' : 'Rejected',
                'value' : 'Rejected'
            }
         )
    }else if (Status == "Taken"){
        StatusList.push(
            {
                'label' : 'onDelivery',
                'value' : 'onDelivery'
            }
         )

    }else if (Status == "onDelivery"){
        StatusList.push(
            {
                'label' : 'Close',
                'value' : 'Close'
            }
         )
    }

    const onStatusChange = (item , name)=>{
        console.log("updating...")
        updateDatabase(ID , Date , DeliveryFee , DeliveryLocation , DeliveryTime,
            Food , item['value'] ,Total ,User , restaurant )
    }
    return (
        <div className="order-container">
            <div className="order-data">
                <p>{DeliveryLocation}</p>
                    <p>{DeliveryTime} {Date}</p>
                    <p>Total price: {Total} EGP, Fees: {DeliveryFee} EGP</p>
              
              
            </div>
            <div className="order-food">
                {foods}
            </div>
            <div className="dropdown-status">
                <Dropdown
                    name="Restaurant"
                    title={Status}
                    className="menu"
                    searchable={["Search for restaurant", "No matching restaurant"]}
                    list={StatusList}
                    onChange={onStatusChange}
                />
            </div>
         
        </div>
    )
}


export default Order;