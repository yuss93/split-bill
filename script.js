// DOM ELEMENTS
let Equal = document.getElementById("Equal");
let Custom = document.getElementById("Custom");
let CustomSplit = document.getElementById("custom-split");
let bill = document.getElementById("bill-input");
let people= document.getElementById("people-input");
let TotalP = document.getElementById("total-display");
let customTip = document.getElementById("custom-tip");
let calculateBtn=document.getElementById("calculate-btn");
let errorP = document.getElementById("error");
let tipSelect = document.getElementById("tip");
let mode = "equal";
let peopleList = [];
let ADDPe = document.getElementById("add");
let AddError=document.getElementById("add-error");

// EVENT LISTENERS
ADDPe.addEventListener("click",function(){
    let presonName =document.getElementById("name").value;
    let personAmount = parseFloat(document.getElementById("order-amount").value);
    if (presonName.trim()==="" || personAmount<0|| isNaN(personAmount) ||!isNaN(presonName)){
        AddError.textContent="please enter a valid name and amount";
        return;
    }
    AddError.textContent="";
    peopleList.push({name: presonName,amount:personAmount});
    document.getElementById("name").value="";
    document.getElementById("order-amount").value="";
    let li = document.createElement("li");
    li.textContent=presonName+" - $" + personAmount.toFixed(2);
    document.getElementById("list").appendChild(li);

});

Equal.addEventListener("click",function(){
    mode="equal"
    peopleList=[];
    document.getElementById("list").innerHTML="";
    CustomSplit.classList.add("hidden");
});

Custom.addEventListener("click",function(){
    mode="custom";
    CustomSplit.classList.remove("hidden")
});

tipSelect.addEventListener("change",function(){

    if (tipSelect.value==="custom"){
        customTip.classList.remove("hidden");
    }
    else{
        customTip.classList.add("hidden");

    }
});

// CALCULATE

calculateBtn.addEventListener("click",function(){
    if (mode==="equal"){
        calculateEqual();
    }
    else{
        calculateCustom();
    }
});

function getTip(){
    let tip;
    if (tipSelect.value=== "custom"){
        tip = parseFloat(customTip.value);

    }
    else{
        tip = parseFloat(tipSelect.value);
    }    
    if (tip>0){
        tip = tip/100;
    }
    return tip;
}
function calculateEqual(){
    let billAmount = parseFloat(bill.value);
    let numPeople = parseInt(people.value);
    if (billAmount<=0 || numPeople<=0 || isNaN(billAmount)|| isNaN(numPeople)){
        TotalP.textContent="";
        errorP.textContent="you cant input negative number! or zero";
        return;
    }
    errorP.textContent="";
    let share = billAmount/numPeople;
    let tip = getTip();   
    if (tip>0){
        share = share + share*tip;
    }
    TotalP.textContent="each person will have to pay:$"+ share.toFixed(2);

}
function calculateCustom(){
    document.getElementById("result-list").innerHTML = "";
    if (peopleList.length===0){
        errorP.textContent = "Please add at least one person!";
        return;
    }
    errorP.textContent="";
    let tip = getTip();
    let ul = document.getElementById("result-list");
    let totalAmount = peopleList.reduce((sum,p)=>sum + p.amount,0);
    TotalP.textContent = "Total bill: $" + totalAmount.toFixed(2);
    let header = document.createElement("strong");
    header.textContent = "Each person pays: ";
    ul.appendChild(header); 
    for (let i=0;i<peopleList.length;i++){
        let person = peopleList[i];
        let amount = person.amount;
        if (tip>0){
            amount = amount + amount*tip;
        }
        let li = document.createElement("li");
        li.textContent = person.name + " pays $" + amount.toFixed(2);
        ul.appendChild(li);
    }
}