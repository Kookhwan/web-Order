<!DOCTYPE html>

<html lang="en">
<head>
	<meta charset="utf-8" />
	<title>Assignment4 (Receipt)</title>
	<script src="http://code.jquery.com/jquery-1.10.2.js"></script>
	<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
	<link rel="stylesheet" href="css/main.css">
	<?php
        /*Get item option*/
		function getOption($str)
		{
			return substr($str, strpos($str, "option") + 8);
		}
		
        /*Get tax rate of province*/
		function getTaxRate($prv)
		{
            if ($prv =="AB") 
            {
                return 0.05;
            }
            else if ($prv =="BC") 
            {
                return 0.12;
            }
            else if ($prv =="MB") 
            {
                return 0.13;
            }
            else if ($prv =="NB") 
            {
                return 0.15;
            }
            else if ($prv =="NL") 
            {
                return 0.15;
            }
            else if ($prv =="NS") 
            {
                return 0.15;
            }
            else if ($prv =="NT") 
            {
                return 0.05;
            }
            else if ($prv =="NU") 
            {
                return 0.05;
            }
            else if ($prv =="ON") 
            {
                return 0.13;
            }
            else if ($prv =="PE") 
            {
                return 0.15;
            }
            else if ($prv =="QC") 
            {
                return 0.14975;
            }
            else if ($prv =="SK") 
            {
                return 0.11;
            } 
            else if ($prv =="YT") 
            {
                return 0.05;
            }            
		}

		/*Get shipping cost*/
		function getShipping($amt)
		{
			if ($amt > 0 && $amt <= 25)
			{
				return 3;
			}
			else if ($amt > 25 && $amt <= 50)
			{
				return 4;
			} 
			else if ($amt > 50 && $amt <= 75)
			{
				return 5;
			} 
			else if ($amt > 75)
			{
				return 6;
			}
			return 0;			
		}
		
		/*Get shipping period*/
		function getShipPrd($amt)
		{
			if ($amt > 0 && $amt <= 50)
			{
				return 1;
			} 
			else if ($amt > 50 && $amt <= 75)
			{
				return 3;
			} 
			else if ($amt > 75)
			{
				return 4;
			}
			return 1;			
		}
		
        /*Get error message*/
		function checkManField($field, $name)
		{
			if (empty($field))
			{
				return $name." field is empty.";
			}
			else
			{
				return "";
			}
		}
		
        /*Get validate postal code*/
		function validatePostal($postalCode)
		{
			$regStr = "/^([a-ceghj-npr-tv-z]){1}[0-9]{1}[a-ceghj-npr-tv-z]{1}[0-9]{1}[a-ceghj-npr-tv-z]{1}[0-9]{1}$/i";
			if(preg_match($regStr ,$postalCode))
				return "";
			else
				return "Invalid Postal Code";
		}
	?>
    
</head>

<body>
	<div id="all_frame">
		<?php 
		# member variables
		$cnt = $_POST["itemCount"];
		$itemStr = array($cnt);	
		$total = 0;

		$hasError = false;
		$errCnt = 7;
		$eMsg = array($errCnt);

		$eMsg[1] = checkManField($_POST["fname"], "First Name");
		$eMsg[2] = checkManField($_POST["lname"], "Last Name");
		$eMsg[3] = checkManField($_POST["address"], "Address");
		$eMsg[4] = checkManField($_POST["city"], "City");
		$eMsg[5] = checkManField($_POST["province"], "Province");
		$eMsg[6] = checkManField($_POST["postal"], "Postal Code");
		$eMsg[7] = validatePostal($_POST["postal"]);

		$errorRow = 0;
		for ($i = 1; $i <= $errCnt; $i++ )
		{
			if (!empty($eMsg[$i]))
			{
				$hasError = true;
				$errorRow = $errorRow + 1;
			}
		}

		if ($hasError)
		{
		?>	
			<table class="shipTo">
                <thead>
                    <tr>
                        <td rowspan="<?php $errorRow?>" id="shipTitle" style="width: 33%;"><b>Error has occured!:</b></td>
                    </tr>
                </thead>
		<?php 
		for ($i = 1; $i <= $errCnt; $i++ )
		{
			if (!empty($eMsg[$i]))
			{
				echo "<tr><td>$eMsg[$i]</td></tr>";
			}
		}
		?>	
				
			</table><br><br>			
		<?php 	
		}
		else
		{
		
		?>

			<table class="shipTo">
                <caption>
                    <p>Your order has been processed. Please verify the information.</p>
                </caption>
                <thead>
                    <tr>
                        <th colspan="2"><b>Shipping To:</b></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><?php echo $_POST["fname"]." ".$_POST["lname"]; ?></td>
                    </tr>
                    <tr>
                        <td><?php echo $_POST["address"] ?></td>
                    </tr>
                    <tr>
                        <td><?php echo $_POST["city"].", ".$_POST["province"]; ?></td>
                    </tr>
                    <tr>
                        <td><?php echo substr($_POST["postal"], 0, 3)." ".substr($_POST["postal"], 3) ; ?></td>
                    </tr>
                </tbody>
			</table><br>
                
			<table class="shipTo">
                <thead>
                    <tr>
                        <th colspan="2"><b>Order information:</b></th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    for ($i = 1; $i <= $cnt; $i++ )
                    {
                        $price = $_POST["item_price_".$i];
                        $cnts = $_POST["item_quantity_".$i];
                        $amt = $price * $cnts;
                        $total = $total + $amt;
                        $itemStr[$i] = $_POST["item_quantity_".$i];
                        $itemStr[$i] = $itemStr[$i]." ".$_POST["item_name_".$i];
                        $itemStr[$i] = $itemStr[$i]." at $".$_POST["item_price_".$i];
                        $itemStr[$i] = $itemStr[$i]." each";
                        echo "<tr><td>$itemStr[$i]</td><td>$"." $amt"."</td></tr>";
                    }
                    ?>
                    <tr>
                        <td>Tax</td>
                        <td>
                        <?php
                        $taxAmt = number_format(getTaxRate($_POST["province"]) * $total, 2);
                        echo "$taxAmt";
                        ?>
                        </td>
                    </tr>
                    <tr>
                        <td>Delivery</td>
						<td>
                        <?php
                        $delvr = number_format(getShipping($total), 2);
                        echo "$delvr";
                        ?>
                        </td>
                    </tr>
					<tr><td colspan="2"></td></tr>
                    <tr>
                        <td>Total</td>
						<td>
                        <?php
                        $Grdtotal = number_format($total + $taxAmt + $delvr, 2);
                        echo "$"."$Grdtotal";
                        ?>
                        </td>
                    </tr>
                </tbody>
			</table>
			
			<table class="shipTo">
                <caption>
                    <?php
                        $shipPrd = getShipPrd($total);
						$shipDate = date('d/m/Y', time() + ($shipPrd * 24 * 60 * 60));
                    ?>
					<p>Estimated Delivery Date: <b><?php echo "$shipDate";  ?></b></p>
                </caption>
			</table>
		<?php
		}
		?>
	<div id="back" class="btns"><a href="javascript:;" >Go Back</a></div>
	</div>
	<script src="js/receipt.js"></script>
</body>
</html>