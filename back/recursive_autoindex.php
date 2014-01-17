<?php
/**
	REQUEST
		http://lab.ogre.be/back/recursive_autoindex.php?/salutpublic/home
	OR
		WITH URL REWRITE :
			NGINX
				location /salutpublic/archive/ {
					rewrite ^(.*)$ /back/recursive_autoindex.php;
				}
		http://lab.ogre.be/salutpublic/archive/

	RETURN
		json_encode(array(
			'status'	=> 'ok',
			'origin'	=> $_SERVER['PHP_SELF'],
			'data'		=> MULTIDIMENSIONAL ARRAY )
		);
	OR
		json_encode(array(
			'status'	=> 'ko',
			'origin'	=> $_SERVER['PHP_SELF'],
			'error'		=> 'file not found : ' FILE_REQUESTED_ADRESS )
		);
*/
	
    header("Access-Control-Allow-Origin: *");
	header('Content-type: application/json');


	if($_SERVER['PHP_SELF'] === array_shift(explode("?", $_SERVER['REQUEST_URI'])))
	{
		$dir = array_shift(array_keys($_GET));
	}
	else{
		$dir = $_SERVER['REQUEST_URI'];
	}

	$directory = str_replace($_SERVER['PHP_SELF'], '', $_SERVER['SCRIPT_FILENAME']) . $dir;

	if(!file_exists($directory)){
		echo json_encode(array(
			'status'	=> 'ko',
			'directory'	=> $_SERVER['REQUEST_URI'],
			'origin'	=> $_SERVER['PHP_SELF'],
			'error'		=> 'file not found : ' . $dir )
		);
		exit();
	}

	$ritit = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory), RecursiveIteratorIterator::CHILD_FIRST);
	$r = array();
	foreach ($ritit as $splFileInfo)
	{
		$entry = $splFileInfo->getFilename();
		if($entry && "." != $entry && ".." != $entry && ".DS_Store" != $entry){
			$path = $splFileInfo->isDir()
				? array($splFileInfo->getFilename() => array())
				: array($splFileInfo->getFilename());

			for ($depth = $ritit->getDepth() - 1; $depth >= 0; $depth--) {
				$path = array($ritit->getSubIterator($depth)->current()->getFilename() => $path);
			}
			$r = array_merge_recursive($r, $path);
		}
	}

	echo json_encode(array(
		'status'	=> 'ok',
		'directory'	=> $_SERVER['SCRIPT_FILENAME'],
		'origin'	=> $_SERVER['PHP_SELF'],
		'data'		=> $r )
	);
?>