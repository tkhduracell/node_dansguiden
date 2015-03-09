
var _ = require('lodash-node');
var express = require('express');
var images = require('../public/images.js');
var router = express.Router();

router.get('/', function (req, res) {
	res.render('index', {
        images: images
	});
});


router.get('/version', function (req, resp) {
    /*
    <?php

        function get_string_between($string, $start, $end){
            $string = " ".$string;
            $ini = strpos($string,$start);
            if ($ini == 0) return "";
            $ini += strlen($start);
            $len = strpos($string,$end,$ini) - $ini;
            return substr($string,$ini,$len);
        }
    $url = "https://play.google.com/store/apps/details?id=feality.dans";
    $raw = file_get_contents($url);

    //$xml = simplexml_load_string();

    $cut = trim(get_string_between($raw, "<div class=\"details-section whatsnew\">", "<div class=\"show-more-end\"></div>"));

    $cut = str_replace("<br />", "", $cut)."</div>";

    //echo $cut;
    $xml = simplexml_load_string($cut);
    $lines = $xml->xpath("//div[@class='recent-change']");

    $versions = array();
    foreach($lines as $l){
        if(preg_match("/v \d+\.\d(\.\d)?/", $l)){
            $versions[]=array("version" => "$l", "text" => array());
        } else {
            array_push($versions[count($versions) - 1]["text"], str_replace("* ", "", "$l"));
        }
    }
    echo json_encode($versions);
    ?>
    */
});


module.exports = router;