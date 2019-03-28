<?php
/**
 * Created by PhpStorm.
 * User: ander
 * Date: 28/03/19
 * Time: 10:35
 */

namespace Creary;

class Lang
{

    const LANG_DIR = __DIR__ . '/../../language/';

    /**
     * @return mixed
     */
    public static function getAvailableLangs() {
        $isoLangs = file_get_contents(self::LANG_DIR . 'isolangs.json');
        return json_decode($isoLangs, true);
    }

    /**
     * @param string $lang
     * @return mixed
     */
    public static function getLang(string $lang = 'en') {
        $availableLangs = self::getAvailableLangs();

        if (!$availableLangs[$lang] || !$lang) {
            $lang = 'en';
        }

        $language = file_get_contents(self::LANG_DIR . 'lang-' . $lang . '.json');
        return json_decode($language);
    }
}