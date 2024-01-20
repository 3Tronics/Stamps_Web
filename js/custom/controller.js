
window.addEventListener("load", () => {
   // document.querySelector("#signup").addEventListener("click", signUp);
   // document.querySelector("#rpass").addEventListener("keyup", checkpassword);
   // document.querySelector("#firstname").addEventListener("keyup", checkFirstName);
  // document.querySelector("#lastname").addEventListener("keyup", checkLastName);
    document.querySelector("#buy").addEventListener("click", buyItems);
});

function signUp() {
    document.getElementById("logindiv").style.display = "none";
    document.getElementById("registerdiv").style.display = "block";
}

//===================================== CHECK REGISTRATION ===============================================

function checkFirstName() {
    var firstname = document.querySelector("#firstname").value;
    userOperations.checkName(firstname, "wrongfirst");
}

function checkLastName() {
    var lastname = document.querySelector("#lastname").value;
    userOperations.checkName(lastname, "wronglast");
}

function checkUser(json, key) {
    var object = JSON.parse(json);

    object[key].forEach((currentuser) => {
        var user = document.querySelector("#rusername").value;
        var usercheck = currentuser.username;
        if ((user.localeCompare(usercheck)) == 0) {
            alert("User already exist");
            document.querySelector("#rusername").value = " ";
        } else {
            if (userOperations.checkLength(user, 5, 25)) {
                document.querySelector("#duplicateuser").innerHTML = "Username should be between 5-25 characters";
            } else {
                document.querySelector("#duplicateuser").innerHTML = " ";
                checkBlank();
            }
        }
    });
    ajaxcall.ajax(printMainMenu, "http://localhost/GroceryMart/json/menu.json", "mainmenu");
}

function checkpassword() {
    var passwordborder = document.querySelector("#rpass");
    var password = passwordborder.value;
    var hpass = document.querySelector("#hpass");

    if (userOperations.checkLength(password, 5, 25)) {
        userOperations.applyClass(passwordborder, "red", hpass, "incorrectregister", "Password should be between 5-25 characters");
    } else if (password.length <= 7) {
        userOperations.applyClass(passwordborder, "red", hpass, "incorrectregister", "Weak");
    } else if (password.length < 11 && !userOperations.alphanumeric(password)) {
        userOperations.applyClass(passwordborder, "green", hpass, "incorrectgreen", "Strong");
    } else if (password.length < 11) {
        userOperations.applyClass(passwordborder, "orange", hpass, "incorrectorange", "Medium");
    } else {
        userOperations.applyClass(passwordborder, "green", hpass, "incorrectgreen", "Strong");
    }
}

function checkBlank() {
    var firstname = document.querySelector("#firstname").value;
    var lastname = document.querySelector("#lastname").value;
    var username = document.querySelector("#rusername").value;
    var address = document.querySelector("#address").value;
    var password = document.querySelector("#rpass").value;
    var wrongfirst = document.querySelector("#wrongfirst").innerHTML;
    var wronglast = document.querySelector("#wronglast").innerHTML;
    var existinguser = document.querySelector("#duplicateuser").innerHTML;

    if (wrongfirst.length > 1 || wronglast.length > 1 || existinguser.length > 1 || firstname.length < 1 || lastname.length < 1 || username.length < 1 || address.length < 1 || password.length < 1) {
        document.querySelector("#mandatory").innerHTML = "Conditions are not fulfilled**";
    } else {
        document.getElementById("registerdiv").style.display = "none";
        document.getElementById("homediv").style.display = "block";
    }
}

//=========================================== LOGIN ==================================================

function checkuser(json, key) {
    var flag = true;
    var object = JSON.parse(json);

    object[key].forEach((currentuser) => {
        var user = document.querySelector("#username").value;
        var usercheck = currentuser.username;

        var password = document.querySelector("#pass").value;
        var passwordcheck = currentuser.password;
        if (((user.localeCompare(checkuser)) && (password.localeCompare(passwordcheck))) == 0) {
            flag = true;
        }
    });

    if (flag) {
        document.getElementById("logindiv").style.display = "none";
        document.getElementById("homediv").style.display = "block";
        ajaxcall.ajax(printMainMenu, "http://localhost/GroceryMart/json/menu.json", "mainmenu");
        ajaxcall.ajax(printYears, "http://localhost/GroceryMart/json/CAN.json", "submenu");
        ajaxcall.ajax(printSubMenu, "http://localhost/GroceryMart/json/Vegetable.json", "submenu");
    } else {
        document.querySelector("#incorrectpass").innerHTML = "Invalid username or password !!";
    }
}

//=========================================== START ================================================


function start() {
    var flag = true;

    if (flag) {
       // document.getElementById("logindiv").style.display = "none";
        document.getElementById("homediv").style.display = "block";
        ajaxcall.ajax(printMainMenu, "http://localhost/GroceryMart/json/menu.json", "mainmenu");
        ajaxcall.ajax(printYears1, "http://localhost/GroceryMart/json/CAN.json", "submenu");
        ajaxcall.ajax(printYears2, "http://localhost/GroceryMart/json/CAN.json", "submenu");
        ajaxcall.ajax(printSubMenu, "http://localhost/GroceryMart/json/CAN.json", "submenu");
       
    } else {
        document.querySelector("#incorrectpass").innerHTML = "Invalid username or password !!";
    }
}

//=========================================== OPTION SELECTED ================================================

function selectCountry() {
    filterCountry = document.getElementById("selcountry").value;
   //reprint page with filter
   ajaxcall.ajax(printSubMenu, "http://localhost/GroceryMart/json/CAN.json", "submenu");
 
}
function selectYear1() {
    filterYear1 = document.getElementById("selyear1").value;
    filterYear2 = document.getElementById("selyear1").value;
    setElement("selyear2", filterYear1);
    ajaxcall.ajax(printSubMenu, "http://localhost/GroceryMart/json/CAN.json", "submenu");

}

function selectYear2() {
    filterYear2 = document.getElementById("selyear2").value;
    ajaxcall.ajax(printSubMenu, "http://localhost/GroceryMart/json/CAN.json", "submenu");

}
//=========================================== MAIN MENU ================================================
function printMainMenu(json, key) {
    var object = JSON.parse(json);
    object[key].forEach((currentmenu) => {

        let option = document.createElement("option");
        option.innerHTML = currentmenu.key;   
        option.setAttribute("value", currentmenu.subkey);
        option.addEventListener("click", callSubMenu);
        document.querySelector("#selcountry").appendChild(option);

    });
  
}

//============================================ printYears1 =================================================

function printYears1(json, key) {
    const years = [];
    var object = JSON.parse(json);
    object[key].forEach((currentmenu) => {
    
        years.push(currentmenu.year);
       
    });
    const yearssorted=sort_unique(years); 
    yearssorted.forEach((item) => {
        let option = document.createElement("option");
        option.innerHTML = item;
        option.setAttribute("value", item);
        option.addEventListener("click", callSubMenu);
        document.querySelector("#selyear1").appendChild(option);
    });
}

//============================================ printYears2 =================================================

function printYears2(json, key) {
    const years = [];
    var object = JSON.parse(json);
    object[key].forEach((currentmenu) => {
    
        years.push(currentmenu.year);
       
    });

    const yearssorted=sort_unique(years);
  
    yearssorted.forEach((item) => {

        let option = document.createElement("option");
        option.innerHTML = item;
        option.setAttribute("value", item);
        option.addEventListener("click", callSubMenu);
        document.querySelector("#selyear2").appendChild(option);
    });
}


//============================================ SELECT ELEMENT =================================================

function setElement(id, valueToSelect) {    
    let element = document.getElementById(id);
    element.value = valueToSelect;
}

//============================================ SORT ARRAY =================================================

function sort_unique(arr) {
    if (arr.length === 0) return arr;
    arr = arr.sort(function (a, b) { return a*1 - b*1; });
    var ret = [arr[0]];
    for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
      if (arr[i-1] !== arr[i]) {
        ret.push(arr[i]);
      }
    }
    return ret;
  }

//============================================ callSubMenu =================================================

function callSubMenu(event) {
    var btn = event.srcElement;
    // btn.classList.toggle("clicked");
    var id = this.getAttribute("menu-id");
    ajaxcall.ajax(printSubMenu, "http://localhost/GroceryMart/json/" + id + ".json", "submenu","CAN",1960);
}

//====================================== FILTER ================================================

function FilterCheck(currentObject){

    var isFiltered = false;
    if(currentObject.country != filterCountry) isFiltered = true; 
    if(filterYear1 === filterYear2){
        if(currentObject.year != filterYear1) isFiltered = true; 
    }
    else{
        var currentyear = Number(currentObject.year);
        if (currentyear.notbetween( Number(filterYear1), Number(filterYear2))) isFiltered = true;   
    }
    return isFiltered
}

Number.prototype.notbetween = function(a, b) {
    var min = Math.min(a, b), max = Math.max(a, b);
    return this < min || this > max;
};


//============================================ ITEMS =================================================

function printSubMenu(json, key) {

    if(filterCountry == ""){
        filterCountry = document.getElementById("selcountry").value;
        filterYear1 = document.getElementById("selyear1").value;
        filterYear2 = document.getElementById("selyear1").value;     
    }

    document.querySelector("#submenu").innerHTML = " ";
    var object = JSON.parse(json);
    object[key].forEach((currentObject) => {

        var isfiltered = FilterCheck(currentObject);
        if( !isfiltered ){        

            let div = document.createElement("div");
            document.querySelector("#submenu").appendChild(div);
            div.className = "divmain";
    
            let divimage = document.createElement("div");
            div.appendChild(divimage);
            divimage.className = "divimage";
    
            let divlist = document.createElement("div");
            div.appendChild(divlist);
    
            let img = document.createElement("img");
            img.src = currentObject.imageurl;
            img.id = "imgsize";
            img.addEventListener("click", () => {
                var modalzoom = document.getElementById("zoomModal");      
                var modalImg = document.getElementById("img01");
                var captionText = document.getElementById("caption");

                modalzoom.style.display = "block";
                modalImg.src = currentObject.imageurl;
                captionText.innerHTML = currentObject.description;
                  // Get the <span> element that closes the modal
                var span = document.getElementsByClassName("closezoom")[0];
                var zoom = document.getElementsByClassName("modalzoom")[0];
                span.onclick = function () {
                    modalzoom.style.display = "none";
                };
                zoom.onclick = function () {
                    modalzoom.style.display = "none";
                };
            });

            divimage.appendChild(img);  

    
            let ul = document.createElement("ul");
            ul.className = "ul";
            divlist.appendChild(ul);
    
            let lirating = document.createElement("li");
            lirating.innerHTML = "Like " + currentObject.rating;
            lirating.className = "rating";
            lirating.addEventListener("click", () => {
                currentObject.rating = currentObject.rating + 1;
                lirating.innerHTML = "Like " + currentObject.rating;
            });
            
            ul.appendChild(lirating);
    
            let liprice = document.createElement("li");
            liprice.innerHTML = currentObject.price;
            liprice.className = "price";
            ul.appendChild(liprice);
    
            let liquantity = document.createElement("li");
            liquantity.innerHTML = "Quantity : " + currentObject.quantity;
            liquantity.className = "quantity";
            ul.appendChild(liquantity);
    
            let country = document.createElement("li");
            country.innerHTML = currentObject.country + "  " + currentObject.year;
            country.className = "country";
            ul.appendChild(country);
    
            let description = document.createElement("li");
            description.innerHTML = currentObject.description;
            description.className = "description";
            ul.appendChild(description);
    
            let btnaddtocart = document.createElement("button");
            btnaddtocart.innerHTML = "Add To Cart";
            btnaddtocart.className = "btnaddtocart";
            btnaddtocart.addEventListener("click", () => {
                if(currentObject.quantity > 0){
                    cartOperations.add(currentObject);
                    currentObject.quantity--;
                    liquantity.innerHTML = "Quantity : " + currentObject.quantity;
                    //liquantity.innerHTML="Quantity : "+ cartOperations.calcQuantity(currentObject.quantity);
                    updateCount();
                    printBill(currentObject);
                }
     
            });
            div.appendChild(btnaddtocart);
        }


    });
}

//====================================== CART NOTIFICATION ================================================

const updateCount = () => {
    document.querySelector("#cartlabel").innerHTML = cartOperations.itemList.length;
}

//========================================== CART ITEMS ===================================================

function printBill(currentObject) {
    var itemTable = document.querySelector("#itemtable");
    var tr = itemTable.insertRow();
    let index = 0;

    for (let key in currentObject) {

        if (key == "imageurl") {
            tr.insertCell(index).innerHTML = `<img class='url' src='${currentObject[key]}'/>`;
            index++;
            finalbill.push(currentObject[key])
        }

        if (key == "quantity") {
            tr.insertCell(index).innerHTML = 1;
            index++;
        }

        if (key == "price") {

            let USDollar = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            });

            tr.insertCell(index).innerHTML = currentObject[key];

            price = cartOperations.calcPrice(currentObject[key]);
            document.querySelector("#pricevalue").innerHTML = USDollar.format(price);
            // format number to US dollar

            const total = USDollar.format(cartOperations.calcCartSubtotal(price));
            document.querySelector("#totalpricevalue").innerHTML =  total ;

            index++;
        }
    }
}

//============================================ BUY NOW ==============================================

function buyItems() {

    var crlf="\r\n";
    let emailTo = "rol3@gmx.com";
    let emailCC="";
    let emailSub="RDStamps Order"
    let emailBody = "Hello RDstamps" + crlf + crlf + " Can I please order the following stamps" + crlf+ crlf;
    let details = crlf +
    "SHIPPING DETAILS: All shipping originates from British Columbia, Canada. Shipment will be either Lettermail, Small Packet Air, or Canada Post Expedited for larger items. \
    , please wait for an invoice, I always combine shipping." +  crlf + crlf +
    "PAYMENT DETAILS: Paypal , eTransfer (Canada) , other" +  crlf + crlf +
    "RETURNS: I strive for satisfied customers. \
     I continue to accept returns up to 30 days after the sale if you are not completely satisfied." +  crlf + crlf +
  	"CONTACT: I strive to ship your item within 1-3 days after payment. \
    You will receive an e-mail notification shortly after shipment is made." + crlf + crlf +
    "Please contact me with any questions." + crlf +  crlf ;
    
    var i =0;
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    //Print out bill to email
    finalbill.forEach(function(x) {
        i++;
        var stamp = x.substring(x.lastIndexOf('/')+1);
        for (let i = 0; i < 4; i++) {
            stamp = stamp.replace("."," ");
        } 
        stamp = stamp.replace(".jpg"," ");
        emailBody+=  i+" : " +stamp + crlf ;

        
    });
    var price = document.querySelector("#pricevalue").innerHTML;
    emailBody+=crlf + "==================================" ;    
    emailBody+=crlf+"Price = "+ price + crlf  
    emailBody+="Tax @" +(tax*100).toFixed(0) +"% = "+ USDollar.format(Number(price.replace('$',''))*tax) + crlf  
    var total = document.querySelector("#totalpricevalue").innerHTML;
   emailBody+="Price with tax ="+ total + crlf   
    var total = Number(total.replace('$','')) + shipping;
    emailBody+="Shipping = $" +shipping + crlf;
    emailBody+="==================================" + crlf;    
    emailBody+="Total = "+ USDollar.format(total) + " <- Send this amount in USD "+ crlf;
    emailBody+="==================================" + crlf + crlf;
    emailBody+= "Please contact me with any questions." + crlf + "Regards  :-) " + crlf + crlf;
    emailBody+=details;

    emailBody = encodeURIComponent(emailBody);
    
    //location.href = "mailto:jegan.baskaran@domain.de?subject=Hello%20there%20Mr%20Jegan&amp&body=Hello%20Jegan,%0D%0A%0DHowr%20are%20you%20boss."
     location.href = "mailto:"+emailTo+'?cc='+emailCC+'&subject='+emailSub+'&body='+emailBody;
    document.querySelector("#itemtable").innerHTML = " ";
    document.querySelector("#pricevalue").innerHTML = "$ 0";
    document.querySelector("#totalpricevalue").innerHTML = "$ 0";
    price = 0;
    total = 0;
    cartOperations.deleteItem();
    updateCount();
}