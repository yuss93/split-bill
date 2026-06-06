// ---DOM ELEMENTS---
const userName = document.getElementById("user-name");
const greetingEL=document.getElementById("greeting");
const error1 = document.getElementById("error1");
const equalBtn = document.getElementById("Equal");
const customBtn = document.getElementById("Custom");
const backBtn = document.getElementById("back-btn");
const modeTitle = document.getElementById("mode-title");

const tipSelect = document.getElementById("tip");
const customTip = document.getElementById("custom-tip");
const billInput = document.getElementById("bill-input");
const peopleInput= document.getElementById("people-input");
const equalInputs = document.getElementById("equal-inputs");

const customSplit = document.getElementById("custom-split");
const nameInput = document.getElementById("name");
const orderInput = document.getElementById("order-amount");
const addBtn = document.getElementById("add");
const AddError=document.getElementById("add-error");
const peopleList = document.getElementById("list");

const calculateBtn=document.getElementById("calculate-btn");
const errorP = document.getElementById("error");
const resultsArea = document.getElementById("results-area");

// --STATE---
let mode = 'equal';
let people = [];
const hour = new Date().getHours();

// Greeting based on time
function updateGreeting(){
    const name = userName.value.trim();
    if (name ==='' || !isNaN(name)) return;
    const timeGreeting = 
    hour < 12 ? 'Good Morning':
    hour < 18 ? 'Good Afternoon':
                'Good Evening';
    greetingEL.textContent = `${timeGreeting}, ${name.toUpperCase()}!👋`;
}
userName.addEventListener('blur',updateGreeting);
userName.addEventListener("keydown",function(e){
    if(e.key==="Enter"){
        userName.blur();
    }
});

//===SCREEN SWITCHING====
function goToScreen2(){
    const name = userName.value.trim();
    // validate name
    if(name===''||!isNaN(name)){
        error1.textContent = "please enter a valid name first";
        return;
    }
    error1.textContent='';

    //Switch Screens
    document.getElementById('screen-1').classList.remove('active');
    document.getElementById('screen-2').classList.add('active');
    //Rest State
    people=[];
    peopleList.innerHTML='';
    resultsArea.innerHTML = '<p class="placeholder">Results will appear here after calculating...</p>';
    errorP.textContent='';
}
equalBtn.addEventListener('click',()=>{
    mode = 'equal';
    modeTitle.textContent = '⚖ Equal Split';
    equalInputs.classList.remove('hidden');
    customSplit.classList.add('hidden');
    goToScreen2();
});
customBtn.addEventListener('click',()=>{
    mode = 'custom';
    modeTitle.textContent ='✏ Custom Split';
    equalInputs.classList.add('hidden');
    customSplit.classList.remove('hidden');
    goToScreen2();
});
backBtn.addEventListener('click',()=>{
    document.getElementById('screen-2').classList.remove('active');
    document.getElementById('screen-1').classList.add('active');
});

//--TIP SELECTOR---
//show/hide custom tip amount
tipSelect.addEventListener("change",function(){
    if (tipSelect.value==="custom"){
        customTip.classList.remove("hidden");
        customTip.focus();
    }
    else{
        customTip.classList.add("hidden");
    }
});
// --- GET TIP VALUE ---
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
// ==== ADD PERSON (CUSTOM SPLIT) ===
addBtn.addEventListener('click', ()=>{
    const name = nameInput.value.trim();
    const amount = parseFloat(orderInput.value);
    // validate
    if(name ==='' || !isNaN(name)){
        AddError.textContent = 'Please enter a valid name (letters only).';
        return;
    }
    if(isNaN(amount) || amount<0){
        AddError.textContent = 'Please enter a valid amount ( 0 or more).';
        return;
    }
    AddError.textContent='';
    // ADD to state
    people.push({name,amount});
    // display the list
    const li = document.createElement('li');
    li.textContent= `${name} - $${amount.toFixed(2)}`;
    peopleList.appendChild(li);
    // Clear inputs
    nameInput.value='';
    orderInput.value='';
    nameInput.focus();
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

// === Equal split - Total bill / number of people
function calculateEqual(){
    const bill = parseFloat(billInput.value);
    const numPeople = parseInt(peopleInput.value);
    // validate
    if (bill<=0 || isNaN(bill)){
        errorP.textContent="Please enter a valid bill amount";
        return;
    }
    if(isNaN(numPeople)|| numPeople<=0 ){
        errorP.textContent="Please enter a valid number of people";
        return;
    }
    errorP.textContent='';
    const tip = getTip(); 
    const total = bill + bill*tip;
    const share = total/numPeople;
    // Display results
    resultsArea.innerHTML='';

    const totalEl = document.createElement('div');
    totalEl.className='result-total';
    totalEl.textContent=`Total (with tip): $${total.toFixed(2)}`;
    resultsArea.appendChild(totalEl);

    const header = document.createElement('div');
    header.className='result-header';
    header.textContent=`Each of the ${numPeople} people pays: `;
    resultsArea.appendChild(header);

    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `<span class="result-name">Per Person</span><span class="result-amount">$${share.toFixed(2)}</span>`;
    resultsArea.appendChild(item);

    if (tip>0){
        const tipNote = document.createElement('p');
        tipNote.style.cssText = 'font-size:.8rem;color:var(--text-dim);margin-top:.5rem;text-align:center;';
        tipNote.textContent=`Include ${(tip*100).toFixed(0)}% tip`;
        resultsArea.appendChild(tipNote);
    }
}
// == custom split - each person pays their own amount + TIP
function calculateCustom(){
    if (people.length===0){
        errorP.textContent = "Please add at least one person!";
        return;
    }
    errorP.textContent="";
    const tip = getTip();
    const totalAmount = people.reduce((sum,p)=>sum + p.amount,0);
    const totalWithTip = totalAmount + totalAmount*tip;
    // Display result
    resultsArea.innerHTML = '';
    
    const totalEl =document.createElement('div');
    totalEl.className = 'result-total';
    totalEl.textContent = `Total Bill: $${totalWithTip.toFixed(2)}`;
    resultsArea.appendChild(totalEl);

    const header = document.createElement('div');
    header.className = 'result-header';
    header.textContent = 'Each person pays:';
    resultsArea.appendChild(header);
    people.forEach(person => {
    const amount = person.amount + person.amount * tip;
    const item   = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <span class="result-name">${person.name}</span>
      <span class="result-amount">$${amount.toFixed(2)}</span>
    `;
    resultsArea.appendChild(item);
    });
  if (tip > 0) {
    const tipNote = document.createElement('p');
    tipNote.style.cssText = 'font-size:.8rem;color:var(--text-dim);margin-top:.5rem;text-align:center;';
    tipNote.textContent = `Includes ${(tip * 100).toFixed(0)}% tip on each order`;
    resultsArea.appendChild(tipNote);
    }
}