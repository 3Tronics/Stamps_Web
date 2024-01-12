<?php

/*

This is one of the free scripts from www.rdstamps.com
You are free to use this script as long as this copyright message is kept intact

(c) Alf Magne Kalleland, http://www.rdstamps.com - 2005

*/

class rdstamps_tree{

	
	var $elementArray = array();
	var $current_level_Cookie = "rdstamps_expanded"; // Name of the cookie where the expanded nodes are stored.
	var $current_folder_Cookie = "rdstamps_current_folder";
	function rdstamps_tree()
	{


	}



	function writeJavascript()
	{
		?>
		<script>
/************************************************************************************************************
Folder tree - PHP
Copyright (C) 2005 - 2009  DTHMLGoodies.com, Alf Magne Kalleland

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA

Dhtmlgoodies.com., hereby disclaims all copyright interest in this script
written by Alf Magne Kalleland.

Alf Magne Kalleland, 2005 - 2009
Owner of DHTMLgoodies.com

************************************************************************************************************/
		var message = '';
		var plusNode = 'src/icons/rdstamps_plus.gif';
		var minusNode = 'src/icons/rdstamps_minus.gif';
		var openFolder = 'src/icons/folder_open.gif';
		var closedFolder = 'src/icons/folder_closed.gif';

		var current_level_Cookie = '<?php echo $this->current_level_Cookie; ?>';
		var current_folder_Cookie = '<?php echo $this->current_folder_Cookie; ?>';
	
		<?php
		$cookieValue = "";
		if(isset($_COOKIE[$this->current_level_Cookie]))$cookieValue = $_COOKIE[$this->current_level_Cookie];
		echo "var initExpandedNodes =\"".$cookieValue."\";\n";

		?>
		/*
		These cookie functions are downloaded from
		http://www.mach5.com/support/analyzer/manual/html/General/CookiesJavaScript.htm
		*/
		function Get_Cookie(name) {
		   var start = document.cookie.indexOf(name+"=");
		   var len = start+name.length+1;
		   if ((!start) && (name != document.cookie.substring(0,name.length))) return null;
		   if (start == -1) return null;
		   var end = document.cookie.indexOf(";",len);
		   if (end == -1) end = document.cookie.length;
		   return unescape(document.cookie.substring(len,end));
		}
		// This function has been slightly modified
		function Set_Cookie(name,value,expires,path,domain,samesite,secure) {
			expires = expires * 60*60*24*1000;
			var today = new Date();
			var expires_date = new Date( today.getTime() + (expires) );
		    var cookieString = name + "=" +escape(value) +
			   ( (expires)  ? ";expires=" + expires_date.toGMTString() : "") +
			   ( (path)     ? ";path="    + path     : "") +
			   ( (domain)   ? ";domain="  + domain   : "") +
		       ( (samesite) ? ";samesite=lax"        : ";samesite=lax") +
		       ( (secure)   ? ";secure"              : "");
		    document.cookie = cookieString;
		}

		document.addEventListener(current_folder_Cookie, ({detail}) => {
    		const {name, value} = detail
    		console.log(`${name} was set to ${value}`)
		})
		/*
		End downloaded cookie functions
		*/


	function msgbox(message) 
	{ 
     	  alert(message); 
	} 


		function expandAll()
		{
			var treeObj = document.getElementById('rdstamps_tree');
			var images = treeObj.getElementsByTagName('IMG');
			for(var no=0;no<images.length;no++){
				if(images[no].className=='tree_plusminus' && images[no].src.indexOf(plusNode)>=0)expandNode(false,images[no]);
			}


		}
		function collapseAll()
		{
			var treeObj = document.getElementById('rdstamps_tree');
			var images = treeObj.getElementsByTagName('IMG');
			for(var no=0;no<images.length;no++){
				if(images[no].className=='tree_plusminus' && images[no].src.indexOf(minusNode)>=0)expandNode(false,images[no]);
			}
<!--msgbox("collapseAll");-->
		}


		function expandNode(e,inputNode)
		{

			if(initExpandedNodes.length==0)initExpandedNodes=",";
			if(!inputNode)inputNode = this;
			if(inputNode.tagName.toLowerCase()!='img') inputNode = inputNode.parentNode.getElementsByTagName('IMG')[0];
			

			var inputId = inputNode.id.replace(/[^\d]/g,'');
			var parentUl = inputNode.parentNode;
			var subUl = parentUl.getElementsByTagName('UL');
			var selecteddir="src/stamps_for_sale/CAN/0"
			
           
			if(subUl.length==0){	
				//var lis = document.getElementsByTagName('li');
				if(e){
					selecteddir = e.currentTarget.id;
					$('li a').each(function(){
   						$(this).css('background-color',  'white');
						$(this).css('font-weight',  'normal');
					});
					document.getElementById(e.currentTarget.id).style.fontWeight = "bold";					
					document.getElementById(e.currentTarget.id).style.backgroundColor = "#FFCC29";
				}

	
			}
			else{

				if(subUl[0].style.display=='' || subUl[0].style.display=='none'){
				subUl[0].style.display = 'block';

				inputNode.src = minusNode;
				initExpandedNodes = initExpandedNodes.replace(',' + inputId+',',',');
				initExpandedNodes = initExpandedNodes + inputId + ',';	
				inputNode.nextSibling.src=openFolder;
   
				}else{
				subUl[0].style.display = '';
				inputNode.src = plusNode;
				initExpandedNodes = initExpandedNodes.replace(','+inputId+',',',');
				inputNode.nextSibling.src = closedFolder;
				}
			}
			
			
			Set_Cookie(current_level_Cookie,initExpandedNodes,60);
			Set_Cookie(current_folder_Cookie,selecteddir,60);

			//Reload container
			$('#stps').load('index.php #stps > *');
		}

		function initTree()
		{
			// Assigning mouse events
			var parentNode = document.getElementById('rdstamps_tree');
			var lis = parentNode.getElementsByTagName('LI'); // Get reference to all the images in the tree
			for(var no=0;no<lis.length;no++){
				var subNodes = lis[no].getElementsByTagName('UL');
				if(subNodes.length>0){
					lis[no].childNodes[0].style.visibility='visible';
				}else{
					lis[no].childNodes[0].style.visibility='hidden';
				}
			}

			var images = parentNode.getElementsByTagName('IMG');
			for(var no=0;no<images.length;no++){
				if(images[no].className=='tree_plusminus')images[no].onclick = expandNode;
			}

			var aTags = parentNode.getElementsByTagName('A');
			var cursor = 'pointer';
			if(document.all)cursor = 'hand';
			for(var no=0;no<aTags.length;no++){
				aTags[no].onclick = expandNode;
				aTags[no].style.cursor = cursor;
			}
			var initExpandedArray = initExpandedNodes.split(',');

			for(var no=0;no<initExpandedArray.length;no++){
				if(document.getElementById('plusMinus' + initExpandedArray[no])){
					var obj = document.getElementById('plusMinus' + initExpandedArray[no]);
					expandNode(false,obj);
				}
			}
		}

		window.onload = initTree;

		</script>
		<?php

	}



	/*
	This function adds elements to the array
	*/

	function addToArray($id,$name,$parentID,$folder="",$target="",$icon="src/icons/folder_closed.gif", $onclick = ''){


		if(empty($parentID))$parentID=0;
		$this->elementArray[$parentID][] = array(
			'id' => $id,
			'title' => $name,
			'folder' => $folder,
			'target' => $target,
			'icon' => $icon,
			'onclick' => $onclick
		);
//msgbox("addToArray");
	}

//Not used....
	function addToArrayAss($element){

		echo "addToArrayAss";

		if(!isset($element['parentId']) || !$element['parentId']){
			$element['parentId'] = 0;
		}

		$element['folder'] = isset($element['folder']) ? $element['folder'] : 'javascript:return false';
		$element['target'] = isset($element['target']) ? $element['target'] : '';
		$element['icon'] = isset($element['icon']) ? $element['icon'] : 'images/folder_open.gif';
		$element['onclick'] = isset($element['onclick']) ? $element['onclick'] : '';


		$this->elementArray[$element['parentId']][] = array(
			'id' => $element['id'],
			'title' => $element['title'],
			'folder' => $element['folder'],
			'target' => $element['target'],
			'icon' => $element['icon'],
			'onclick' => $element['onclick']
		);

//msgbox("addToArrayAss");

	}

	function drawSubNode($parentID){
		$folder='src/stamps_for_sale/*';
		if(isset($this->elementArray[$parentID])){
			echo "<ul>";
			for($no=0;$no<count($this->elementArray[$parentID]);$no++){
				$folderAdd = " id=\"#\"";
				if($this->elementArray[$parentID][$no]['folder']){
					$folderAdd = " id=\"".$this->elementArray[$parentID][$no]['folder']."\"";
					if($this->elementArray[$parentID][$no]['target'])$folderAdd.=" target=\"".$this->elementArray[$parentID][$no]['target']."\"";
				}
				$onclick = "";
				if($this->elementArray[$parentID][$no]['onclick']){
					$onclick = " onmouseup=\"".$this->elementArray[$parentID][$no]['onclick'].";return false\"";
				}
				echo "<li class=\"tree_node\">";
				$as=$this->elementArray[$parentID][$no]['icon'];
				if(strlen($as)>0){
				  echo "<img class=\"tree_plusminus\" alt=\"icon\" id=\"plusMinus".$this->elementArray[$parentID][$no]['id']."\" src=\"src/icons/rdstamps_plus.gif\"><img src=\"".$this->elementArray[$parentID][$no]['icon']."\">";
				}
				else{
					echo "<img class=\"tree_plusminus\" alt=\"icon\" id=\"plusMinus".$this->elementArray[$parentID][$no]['id']."\" src=\"src/icons/rdstamps_plus.gif\">";
				}
				echo "<a class=\"tree_link\"$folderAdd$onclick>".$this->elementArray[$parentID][$no]['title']."</a>";			
				$this->drawSubNode($this->elementArray[$parentID][$no]['id']);
				echo "</li>";
			}
			echo "</ul>";
		}
	}

	function drawTree(){
		echo "<div id=\"rdstamps_tree\">";
		echo "<ul id=\"rdstamps_topNodes\">";
		for($no=0;$no<count($this->elementArray[0]);$no++){
			$folderAdd = "";
			if($this->elementArray[0][$no]['folder']){
				$folderAdd = " id=\"".$this->elementArray[0][$no]['folder']."\"";
				if($this->elementArray[0][$no]['target'])$folderAdd.=" target=\"".$this->elementArray[0][$no]['target']."\"";
			}
			$onclick = "";
			if($this->elementArray[0][$no]['onclick']){
				$onclick = " onmouseup=\"".$this->elementArray[0][$no]['onclick'].";return false\"";
			}
			echo "<li class=\"tree_node\" id=\"node_".$this->elementArray[0][$no]['id']."\">";
			echo "<img id=\"plusMinus".$this->elementArray[0][$no]['id']."\" alt=\"icon\" class=\"tree_plusminus\" src=\"src/icons/rdstamps_plus.gif\">";
			$ms=$this->elementArray[0][$no]['icon'];
			if(strlen($ms)>0){
				echo "<img alt=\"icon\" src=\"".$this->elementArray[0][$no]['icon']."\">";
			}
			echo "<a class=\"tree_link\"$folderAdd$onclick>".$this->elementArray[0][$no]['title']."</a>";
			$this->drawSubNode($this->elementArray[0][$no]['id']);
			echo "</li>";
		}
		echo "</ul>";
		echo "</div>";
	}


  

}


?>