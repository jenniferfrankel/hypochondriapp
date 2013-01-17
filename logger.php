<?php

	$logfile = "logs/theLogfile.log";
	$logdata = sprintf("[%s][%s] - %s\n", date('r'), $_SERVER['REMOTE_ADDR'], $_POST['log']);
	file_put_contents($logfile, $logdata, FILE_APPEND | LOCK_EX);
?>
