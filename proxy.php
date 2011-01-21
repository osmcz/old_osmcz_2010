<?php

if(substr($_GET['url'], 0, 7) == 'http://')
	echo file_get_contents($_GET['url']);
