//var pinnedIDs = null;
//var mainID = null;
var csrftoken;
$(function(){
    csrftoken = $.cookie('csrftoken');
});
var COURSE_COLOR_MAP;
var SECTION_COLOR_MAP;

/***********************************************************
 * UI Module. An ID is main if its popup is in the sidebar.
 * An ID is pinned if its popup has been dragged away from
 * the sidebar.
 **********************************************************/
/*function UI_pin(id)
{
    if (UI_isMain(id))
        UI_unsetMain();
    pinnedIDs.add(id);
}
function UI_isPinned(id)
{
    return id in pinnedIDs;
}
function UI_unpin(id)
{
    pinnedIDs.remove(id);
}
function UI_isMain(id)
{
    return mainID == id;
}
function UI_setMain(id)
{
    if (UI_isPinned(id))
        UI_unpin(id);
    mainID = id;
}
function UI_unsetMain()
{
    mainID = null;
}*/

/***********************************************************
 * Themes
 **********************************************************/

function loadWhiteTheme()
{
    $('.theme').removeClass('dark');
    $('#theme_css').attr('href','/static/cosmo/bootstrap.css');
}
function loadDarkTheme()
{
    $('.theme').addClass('dark');
    $('#theme_css').attr('href','/static/cyborg/bootstrap.css');
}

/***********************************************************
 * CSRF methods
 **********************************************************/
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

/***********************************************************
 * Useful codes
 **********************************************************/
/**
 * Auto-capitalizes words.
 * Code taken from Stackoverflow, http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript/196991#196991
 */
function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function br2nl(text)
{
    return text.replace(/(\n|\r)/g, "").replace(/<br>/g, "\n"); // g = replace all occurences
}
function nl2br(text)
{
    return text.replace(/(\n|\r)/g, "<br>");
}
