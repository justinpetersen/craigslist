<?php

header('Content-type: application/json');

require_once('../magpierss/rss_fetch.inc');

$craigslistRssUrl = urlencode($_GET["rss"]);
$start = $_GET["start"];
if (is_null($start)) {
	$start = 0;
}
$limit = $_GET["limit"];
if (is_null($limit)) {
	$limit = 10;
}

$feedUrl = "http://pipes.yahoo.com/pipes/pipe.run?FeedUrl=$craigslistRssUrl&_id=YJYsrdrF3RG3_SGwbbsjiw&_render=rss";
$craigslistResults = new CraigslistResults();
$craigslistResults->printSearchResults($feedUrl, $start, $limit);

class CraigslistResults {
	
	public function printSearchResults( $url, $start, $limit ) {
		$rss = fetch_rss($url);
		$items = array();
		$count = 0;
		
		foreach ($rss->items as $item) {
			
			if (($count >= $start) && ($count < $start + $limit)) {
				$title = $item['title'];
				$link = $item['link'];
				$description = $item['description'];
				$imageSource = $this->getFirstImgSrc($description);
				
				if (!$imageSource) {
					$imageSource = 'images/no-image.jpg';
				}
				$jsonItem = array("title" => $title, "link" => $link, "imageSource" => $imageSource, "description" => $description);
				array_push($items, $jsonItem);
			}
			
			$count++;
			
		}
		
		$jsonObject = array("items" => $items);
		
		echo json_encode($jsonObject);
	}
	
	/**
    * Searches for the first occurence of an html <img> element in a string and extracts the src if
	* it finds it. Returns boolean false in case an <img> element is not found.
    * @param    string  $str    An HTML string
    * @return   mixed           The contents of the src attribute in the found <img> or boolean
	*                           false if no <img> is found
    */
    private function getFirstImgSrc( $html ) {
        if (stripos($html, '<img') !== false) {
            $imgsrc_regex = '#<\s*img [^\>]*src\s*=\s*(["\'])(.*?)\1#im';
            preg_match($imgsrc_regex, $html, $matches);
            unset($imgsrc_regex);
            unset($html);
            if (is_array($matches) && !empty($matches)) {
                return $matches[2];
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

}

?>