/*jQuery Part*/

// initialize simplecart module
simpleCart({
	cartColumns: [
		{ attr: "name", label: "Name"},
		{ view: "currency", attr: "price", label: "Unit Price"},
		{ view: "decrement" , label: false , text: "-" } ,
		{ attr: "quantity" , label: "Qty" } ,
		{ view: "increment" , label: false , text: "+" } ,
		{ view: "currency", attr: "total", label: "SubTotal" },
		{ view: "remove", text: "Remove", label: false}
	],

	cartStyle: "table", 
	checkout: { 
		type: "SendForm" , 
        url: "http://localhost/receipt.php" 
	},
	currency: "CAD",
	data: {},
	language: "english-us",
	excludeFromCheckout: [],
	shippingCustom: function() {
		var totalAmt = simpleCart.total();
		var shipC = 0;
		if (totalAmt > 0 && totalAmt <= 25)
		{
			shipC = 3;
		}
		else if (totalAmt > 25 && totalAmt <= 50)
		{
			shipC = 4;
		} 
		else if (totalAmt > 50 && totalAmt <= 75)
		{
			shipC = 5;
		} 
		else if (totalAmt > 75)
		{
			shipC = 6;
		}
		return shipC;
	},
	shippingFlatRate: 0,
	shippingQuantityRate: 0,
	shippingTotalRate: 0,
	taxRate: 0.13,
	taxShipping: false,
	beforeAdd		: null,
	afterAdd		: null,
	load			: null,
	beforeSave		: null,
	afterSave		: null,
	update			: null,
	ready			: null,
	checkoutSuccess	: null,
	checkoutFail	: null,
	beforeRemove    : null
});

// simple callback example
simpleCart.bind( 'beforeCheckout' , function( data ){
    
    var dispMsg = "<fieldset><legend>Error Details</legend>";
	var errMsg = checkValue();
    
	if (errMsg == "")
	{
		data.fname = $("#fname").val();
		data.lname = $("#lname").val();
		data.address = $("#address").val();
		data.city = $("#city").val();
		data.province = $("#province").val();
		data.postal = $("#postal").val();
        
		return true;
	} 
	else
	{
        dispMsg += errMsg + "</fieldset>";
        document.getElementById("errList").innerHTML = dispMsg;
		return false;
	}
});

// init cart
$( document ).ready(function() {
    simpleCart.empty();
});


/*Javascript Part*/

// member variables - for validation
var ptrnStr = /^[a-zA-Z\.\s]{3,50}$/;
var ptrnNum = /^[0-9\.]*$/;
var ptrnSpe = /^[a-zA-Z0-9#\)\(+=._-\s]+$/;
var ptrnPost = /([A-Z]\d){3}/i;
var ptrnPhone = /^\(?\d{3}\)?[\.\-\/\s]?\d{3}[\.\-\/\s]?\d{4}$/
var focusErr = null;

// trim input value
function makeTrim(eleName)
{
	var name = "#" + eleName;
	var str = $(name).val();
	while(str.startsWith(" "))
	{
		str = str.slice(1);
	}
	while(str.endsWith(" "))
	{
		str = str.slice(0, str.length-1);
	}
	$(name).val(str);
	makeCapital(eleName);
    
	return str;
}

// make the first character capitalize
function makeCapital(eleName)
{
	var name = "#" + eleName;
	var str = $(name).val();
	if (str.length > 0)
	{
	    var strArr = str.split(" ");
	    var newStr = "";
	    for (i = 0 ; i < strArr.length; i++)
	    {
	        strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
	        if (strArr[i] != "")
	        {
	            newStr += strArr[i] + " ";
	        }
	    }
	    if (newStr.endsWith(" "))
	    {
	        newStr = newStr.slice(0, newStr.length-1);
	    }
	    $(name).val(newStr);
	}
}

// check string values
function chkStr(eleName, msgName, strMsg, isRequired)
{
	var name = "#" + eleName;
	var valEle = $(name);
	valStr = valEle.val();

	if (valStr.length > 0)
	{
        if (!ptrnStr.test(valStr)) 
        {
            strMsg = strMsg + "Only alphabets are allowed and" + 
                        " the length should be between 3 to 50. [" + msgName + "].<br>";
            if (focusErr === null)
            {
                focusErr = valEle;
            }
        }
	}
	else
	{
		if (isRequired)
		{
			strMsg = strMsg + "Please check the mandatory field. [" + msgName + "].<br>";
			if (focusErr === null)
			{
				focusErr = valEle;
			}
		}
	}
	
	return strMsg; 
}

// check number values
function chkNum(eleName, msgName, strMsg, isRequired)
{
	var name = "#" + eleName;
	var valEle = $(name);
	if (!ptrnNum.test(valEle.val())) 
	{
		strMsg = strMsg + "Only numbers are allowed. [" + msgName + "].<br>";
		if (focusErr === null)
		{
			focusErr = valEle;
		}
	}
	return strMsg; 
}

// check all input values and generate result message
function checkValue() 
{
	var errMsg = "";
	focusErr = null;
	var errMsg = "";
	
	errMsg = chkStr("fname", "First Name", errMsg, true);
	errMsg = chkStr("lname", "Last Name", errMsg, true);
	errMsg = chkStr("city", "City", errMsg, true);
    
	valEle = $("#address");
	makeTrim("address");
	if (valEle.val().length == 0) 
	{
		errMsg = errMsg + "Please check the mandatory field. [Address].<br>";
		if (focusErr === null)
		{
			focusErr = valEle;
		}
	}
	else if(valEle.val().length > 0 && !ptrnSpe.test(valEle.val())) 
	{
        errMsg = errMsg + "Some specific characters[!$@%^&*] are not allowed [Address].<br>";
		if (focusErr === null)
		{
			focusErr = valEle;
		}
	}
    else if(valEle.val().length < 3 || valEle.val().length > 50) 
    {
        errMsg = errMsg + "The length should be between 3 to 50 [Address].<br>";
		if (focusErr === null)
		{
			focusErr = valEle;
		}
    }
    
	valEle = $("#postal");
	if (valEle.val().length == 0) 
	{
		errMsg = errMsg + "Please check the mandatory field. [Postal Code].<br>";
		if (focusErr === null)
		{
			focusErr = valEle;
		}
	}	
	if (valEle.val().length > 0 && !ptrnPost.test(valEle.val())) 
	{
		errMsg = errMsg + "Wrong format error. [Postal code - ex) A1A2A3].<br>";
		if (focusErr === null)
		{
			focusErr = valEle;
		}
	}
    
    if (simpleCart.quantity() == 0) 
    {
        errMsg += "Please select least one item. [Add to Cart]"
    }
    
	if (focusErr != null)
	{
		focusErr.focus();
	}	

	return errMsg;
}

// make postal code to upper case 
function postUpperCase() 
{
	makeTrim("postal");
	var valEle = $("#postal");
	valEle.val(valEle.val().toUpperCase());
}

// make input to trim and upper case 
$('input[type="text"]').not('.item_Quantity').on('blur', function (e) {
	makeTrim(e.target.id);
});

// make postal to upper case 
$('input[id=postal]').on('blur', function (e) {
	postUpperCase(e.target.id);
});

// change tax rate
$('select[id=province]').on('change', function (e) {
	var prv = e.target.value;
	if (prv =="AB") 
	{
		simpleCart.taxRate(0.05);
	}
	else if (prv =="BC") 
	{
		simpleCart.taxRate(0.12);
	}
	else if (prv =="MB") 
	{
		simpleCart.taxRate(0.13);
	}
	else if (prv =="NB") 
	{
		simpleCart.taxRate(0.15);
	}
	else if (prv =="NL") 
	{
		simpleCart.taxRate(0.15);
	}
	else if (prv =="NS") 
	{
		simpleCart.taxRate(0.15);
	}
	else if (prv =="NT") 
	{
		simpleCart.taxRate(0.05);
	}
	else if (prv =="NU") 
	{
		simpleCart.taxRate(0.05);
	}
	else if (prv =="ON") 
	{
		simpleCart.taxRate(0.13);
	}
	else if (prv =="PE") 
	{
		simpleCart.taxRate(0.15);
	}
	else if (prv =="QC") 
	{
		simpleCart.taxRate(0.14975);
	}
	else if (prv =="SK") 
	{
		simpleCart.taxRate(0.11);
	} 
	else if (prv =="YT") 
	{
		simpleCart.taxRate(0.05);
	}
	simpleCart.update();
});

// make postal to upper case 
$('input[id=postal]').on('blur', function (e) {
	postUpperCase(e.target.id);
});


//////////////////////////////////////////////////////////////////////////
// For test data
$("#fname").val("Jane");
$("#lname").val("Smith");
$("#address").val("299 Doon Valley Drive");
$("#city").val("Kitchener");
$("#province").val("ON");
$("#postal").val("N2S2M1");
//////////////////////////////////////////////////////////////////////////
