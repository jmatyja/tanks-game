var size_info_shown = false;
var perform_search_timer = null;
var last_touch = null;
var last_touch_x = null;
var
    last_touch_y = null;
var last_scrolltop = 0;
var scrolling_up_since = null;
var scrolling_down_since = null;
$(document
).ready(function () {
        $(document).on("change", ".styled-select select", function () {
            var e = this;
            var f = $(this
            ).closest(".styled-select");
            $(f).find("span:not([class])").text($(e).find("option:selected").text())
        });
        custom_checkboxes();
        $("input, textarea").placeholder();
        $("img.lazy").lazyload({threshold: 500});
        $("
            .product - grid
        a
        ").click(function(){if($("
        html
        ").hasClass("
        touch
        ")&&!$(this).hasClass("
        hover
        ")){$(".product - grid
        a
        ").not(this).removeClass("
        hover
        ");$(this).addClass("
        hover
        ");return false}}).hover(function(){if(!$
        ("html").hasClass("touch")
        )
        {
            $(".product-grid a").not(this).removeClass("hover");
            $(this).addClass("hover"
            )
        }
    }, function () {
        if (!$("html").hasClass("touch")) {
            $(this).removeClass("hover")
        }
    });
$(".product-info .share
    ,.blog - detail.share
").hover(function(){if(!$("
html
").hasClass("
touch
")){$(this).addClass("
hover
")}
},
function () {
    $(this).removeClass("hover")
}
).
click(function () {
    if ($("html").hasClass("touch") && !$(this
        ).hasClass("hover")) {
        $(this).addClass("hover");
        return false
    }
});
$("#currency").hover(function () {
    $("a.cart-link"
    ).css("visibility", "hidden")
}, function () {
    $("a.cart-link").css("visibility", "visible")
});
var b = $(window
    ).height() - $("header").outerHeight(true) - $("#slideshow0").outerHeight(true) - $("ol.breadcrumb").outerHeight
    (true) - $("div.newsletter").outerHeight(true);
$("#content").css("min-height", b);
var b = $(window).height
    () - $("header").outerHeight(true) - $("ol.breadcrumb").outerHeight(true) - $("div.newsletter").outerHeight
    (true);
$("#search-desktop").css("min-height", b);
$("#search").click(function () {
    start_search();
    return false
});
$(".addthis_sharing_toolbox").on("click", ".at-svc-pinterest_share, .at-svc-thefancy", function () {
    if
    ($(window).width() < 768) {
        $(window).scrollTop(0)
    }
});
$(document).on("keydown", function (h) {
    var g = String.fromCharCode
    (h.keyCode).replace(/[^a-zA-Z0-9 ]/g, "");
    var f = h.target.tagName.toLowerCase();
    if (!$("html").hasClass
        ("touch") && $("header").is(":visible") && (typeof h.metaKey == "undefined" || h.metaKey == false) && g && h.keyCode
        != 116 && !$("#search-desktop").is(":visible") && f != "input" && f != "select" && f != "textarea") {
        start_search();
        $
        ("#search-desktop .search-field").val("")
    }
    if ((h.keyCode == 27 || (h.keyCode == 8 && !$(".search-field").val(
        ))) && $("#search-desktop").is(":visible")) {
        $("#search-desktop").hide();
        $(".hidden-search").removeClass
        ("hidden-search")
    }
});
$("#search-desktop .search-field").keyup(function (f) {
    if (perform_search_timer) {
        clearTimeout
        (perform_search_timer)
    }
    if ($(this).val().length > 1) {
        perform_search_timer = setTimeout("perform_search()"
            , 500)
    } else {
        $("#search-desktop .results, #search-desktop .filters").html("")
    }
    if (f.keyCode == 13) {
        $(this
        ).blur()
    }
}).blur(function () {
    if (!$(this).val()) {
        $("#search-desktop").hide();
        $(".hidden-search").removeClass
        ("hidden-search")
    }
});
$("#mobile-menu input[name=search]").keypress(function (f) {
    if (f.keyCode == 13 && $(this
        ).val()) {
        window.location = "/index.php?route=product/category&search=" + encodeURIComponent($(this).val(
        ))
    }
}).blur(function () {
    if ($(this).val()) {
        window.location = "/index.php?route=product/category&search=" + encodeURIComponent
        ($(this).val())
    }
});
$(document).on("touchmove", function (f) {
    if ($("#ajax-cart-mobile").is(":visible")) {
        if
        ($(f.target).parents("#ajax-cart-mobile").length && $(f.target).parents(".products").length) {
            f.stopPropagation
            ()
        } else {
            f.preventDefault()
        }
    } else {
        if ($("#mobile-menu").is(":visible")) {
            if ($(f.target).parents("#mobile-menu"
                ).length) {
                f.stopPropagation()
            } else {
                f.preventDefault()
            }
        }
    }
});
if ($("ul.product-sizes").length && $.cookie
    ("sizeinfoshown")) {
    size_info_shown = true
}
$(document).click(function (e) {
    if (!$(e.target).is("#ajax-cart"
        ) && $(e.target).parents("#ajax-cart").length == 0 && !$(e.target).is(".cart-link") && $(e.target).parents("
            .cart - link").length==0){ajax_cart_hide()}if(!$(e.target).is(".container
    ")&&$(e.target).parents(".container
    "
    ).
    length == 0 && $("#search-desktop").is(":visible")
    )
    {
        $("#search-desktop").hide();
        $(".hidden-search").removeClass
        ("hidden-search")
    }
});
$(window).scroll(function () {
    if ($(this).scrollTop() > 20) {
        $("header").addClass("scroll"
        );
        $("#ajax-cart").addClass("scroll")
    } else {
        $("header").removeClass("scroll");
        $("#ajax-cart").removeClass
        ("scroll")
    }
});
if (!$("html").hasClass("touch") && navigator.appVersion.match(/MSIE [\d]+/) != "MSIE 8" && navigator
        .appVersion.match(/MSIE [\d]+/) != "MSIE 9") {
    slide_animations(true);
    $(window).bind("scroll resize", function
        () {
        slide_animations()
    })
} else {
    $(".slide-in").removeClass("slide-in")
}
$("#mobile-header .menu-button")
    .click(function () {
        if ($("#ajax-cart-mobile").is(":visible")) {
            ajax_cart_mobile_hide()
        }
        $("#mobile-overlay"
        ).show();
        var e = $(window).width() - $("#mobile-header").height();
        $("#mobile-menu").css({
            display: "block"
            , width: e, left: -e
        });
        $("#mobile-menu").animate({left: 0}, 300);
        $(window).scrollTop(0);
        return false
    });
$("
#
mobile - menu
").on("
touchstart
",function(f){last_touch=f.originalEvent.touches[0].clientY}).on("
touchmove
"
    , function (g) {
    var f = $(this).find(".mobile-menu-top").outerHeight() + $(this).find(".mobile-menu-bottom"
        ).outerHeight() - $(this).height();
    if (g.originalEvent.touches[0].clientY > last_touch) {
        if ($(this).scrollTop
            () <= 0) {
            g.preventDefault()
        }
    } else {
        if (g.originalEvent.touches[0].clientY < last_touch) {
            if ($(this).scrollTop
                () >= f) {
                g.preventDefault()
            }
        } else {
            g.preventDefault()
        }
    }
    last_touch = g.originalEvent.touches[0].clientY
}
)
;
$
("#mobile-header .cart-button").click(function () {
    if ($("#mobile-menu").is(":visible")) {
        mobile_menu_hide
        ()
    }
    $("#mobile-overlay").show();
    $("#ajax-cart-mobile .inner").html("");
    $.post("/index.php?route=module
    / cart
    ",{mobile:true},ajax_cart_loaded_mobile);var e=$(window).width()-$("#mobile - header
    ").height();$
    ("#ajax-cart-mobile").css({display: "block", width: e, right: -e});
    $("#ajax-cart-mobile").animate({
        right: 0
    }, 300);
    return false
});
$(window).resize(function () {
    if ($("#mobile-menu:visible").length) {
        $("#mobile-menu"
        ).stop().css({width: $(window).width() - $("#mobile-header").height(), left: 0})
    }
    if ($("#ajax-cart-mobile:visible"
        ).length) {
        $("#ajax-cart-mobile").stop().css({
            width: $(window).width() - $("#mobile-header").height(), right: 0
        });
        $("#ajax-cart-mobile .products").css("height", $("#ajax-cart-mobile").height() - $("#ajax-cart-mobile
            .summary
        ").outerHeight(true)-$("#ajax - cart - mobile
        h2
        ").outerHeight(true))}if($("#ajax - cart
    :
        visible
        "
    ).
        length
    )
        {
            $("#ajax-cart-placeholder").css({height: $("#ajax-cart").outerHeight()})
        }
    }
    )
    ;
    $("#mobile-overlay"
    ).click(function () {
            if ($("#mobile-menu").is(":visible")) {
                mobile_menu_hide()
            }
            if ($("#ajax-cart-mobile")
                    .is(":visible")) {
                ajax_cart_mobile_hide()
            }
        });
    $(".close-menu").click(function () {
        if ($(this).parents("#mobile-menu"
            ).length) {
            mobile_menu_hide()
        } else {
            ajax_cart_mobile_hide()
        }
        return false
    });
    if (!$("html").hasClass("touch"
        ) && $("#blog-overview").length && navigator.appVersion.match(/MSIE [\d]+/) != "MSIE 8" && navigator.appVersion
            .match(/MSIE [\d]+/) != "MSIE 9") {
        var c = $(window).scrollTop() + $(window).height();
        $(".blog-article:not(
            .first)
        ").each(function(){if(c<$(this).offset().top){var e=Math.round((($(this).offset().left+$(this
    ).
        width() / 2
    )/
        $(window).width()
    )*
        10
    )
        ;
        if (e > 5) {
            $(this).addClass("blog-slide-in-right")
        } else {
            if (e < 5) {
                $(this
                ).addClass("blog-slide-in-left")
            } else {
                $(this).addClass("blog-slide-in")
            }
        }
    }
})
}
$(window).bind("scroll resize"
    , function () {
        blog_slide_animations()
    });
blog_slide_animations();
$("#blog-overview a[data-id]").click(function
    () {
    $(".blog-detail-overlay").show();
    var e = $(".blog-detail[data-id=" + $(this).data("id") + "]");
    e.show()
    ;
    if ($(e).css("position") == "absolute") {
        $(window).scrollTop($(e).offset().top)
    }
    return false
});
$(".blog-detail-overlay
    ,.blog - detail
a.cross
").click(function(){$(".blog - detail - overlay,
.
blog - detail
").hide();$(".modal - slider
"
).
remove();
return false
})
;
$(".blog-detail").click(function (e) {
    if ($(e.target).is(".blog-detail")) {
        $("
            .blog - detail - overlay,.blog - detail
        ").hide();$(".modal - slider
        ").remove()}});$("#footer - arrow
        ").click(function
        ()
        {
            $("html, body").animate({scrollTop: 0});
            return false
        }
    )
        ;
        $("ul.product-sizes a").click(function () {
            $(this
            ).closest("ul").find("a").not(this).removeClass("active");
            $(this).addClass("active");
            $(this).closest
            ("div.option").find("select").val($(this).data("id"));
            if ($(this).hasClass("soldout")) {
                $("#button-cart"
                ).hide();
                $(".soldout-form").show()
            } else {
                $("#button-cart").show();
                $(".soldout-form").hide()
            }
            if (!size_info_shown
            ) {
                show_size_info();
                size_info_shown = true;
                $.cookie("sizeinfoshown", 1, {expires: 30})
            }
            return false
        });
        $(".fp-slider
            .arrow - left
        ").click(function(){var e=$(this).closest(".fp - slider
        ");fp_slider(e,-1)});$(".fp - slider
            .arrow - right
        ").click(function(){var e=$(this).closest(".fp - slider
        ");fp_slider(e)});$(".product - images
        li
        a
        ").click(function(){if(!$("
        html
        ").hasClass("
        touch
        ")||$(window).width()>767){fullscreen_slider()
    }
    return false
});
$(".blog-detail .inner > .blog-slider a").click(function () {
    if ($(".blog-detail:visible
            .inner").width()>$(".blog - detail
    :
    visible.inner
    ").height()&&(!$("
    html
    ").hasClass("
    touch
    ")||$(window
    ).
    width() > 768
    ))
    {
        modal_slider()
    }
    return false
});
$(".lookbook-item.detail").click(function () {
    $(this).toggleClass
    ("active")
});
$(".cart-info td.quantity input").change(function () {
    $(this).next("button").click()
});
$("
    .expand - category - info
").click(function(){var e=$(".category - info - inner
").height();if($(this).hasClass
("cross")
)
{
    $(this).removeClass("cross");
    $(".category-info").stop();
    $(".category-info").css({
        maxHeight: $(".category-info").height()
    });
    $(".category-info").animate({maxHeight: 80});
    $(".gradient").fadeIn()
}
else
{
    $(this).addClass("cross");
    $(".category-info").animate({maxHeight: e}, function () {
        $(this).css({
            maxHeight: "none"
        })
    });
    $(".gradient").fadeOut()
}
return false
})
;
$(".expand-long-description").click(function () {
    if
    ($(this).hasClass("cross")) {
        $(this).removeClass("cross");
        $(".product-long-description").slideUp()
    } else {
        $(this).addClass("cross");
        $(".product-long-description").slideDown()
    }
    return false
});
$(".expand-size-explanation"
).click(function () {
        if ($(this).hasClass("cross")) {
            $(this).removeClass("cross");
            $(".size-explanation")
                .slideUp()
        } else {
            $(this).addClass("cross");
            $(".size-explanation").slideDown()
        }
        return false
    });
$("a.size-info"
).click(show_size_info);
$(".size-window-overlay, .size-window a.close-window").click(function () {
    $(".size-window
        ,.size - window - overlay
    ").hide();return false});$(".size - window
    ").click(function(e){if($(e.target).is
    (".size-window")
    )
    {
        $(".size-window, .size-window-overlay").hide()
    }
});
fix_hero_images();
$(window).resize
(function () {
    fix_hero_images()
});
$(".cart-coupons input[type=checkbox]").change(function () {
    if ($(this)
            .is(":checked")) {
        $(this).closest(".cart-coupons").find("input[type=submit]").addClass("active");
        $(this
        ).closest(".cart-coupons").find("input[name=coupon],input[name=advanced_coupon]").addClass("active")
            .focus()
    } else {
        $(this).closest(".cart-coupons").find("input[name=coupon],input[name=advanced_coupon]"
        ).removeClass("active");
        $(this).closest(".cart-coupons").find("input[type=submit]").removeClass("active"
        )
    }
});
$(".cart-coupons input[name=coupon], .cart-coupons input[name=advanced_coupon]").focus(function
    () {
    $(this).closest(".cart-coupons").find("input[type=checkbox]").prop("checked", true).change()
});
$("
#
faq - container.faq - header
").click(function(){if($(this).hasClass("
active
")){$(this).removeClass("
active
"
)
;
$(this).next(".faq-content").slideUp();
$(this).find(".plus-small").removeClass("cross")
}else
{
    $(this
    ).addClass("active");
    $(this).next(".faq-content").slideDown();
    $(this).find(".plus-small").addClass("cross"
    );
    var e = $("#faq-container .faq-header").not(this);
    e.removeClass("active");
    e.next(".faq-content").slideUp
    ();
    e.find(".plus-small").removeClass("cross")
}
})
;
$("header .cart-link").click(function (f) {
    if ($("#ajax-cart"
        ).is(":visible")) {
        ajax_cart_hide()
    } else {
        $("#ajax-cart .container").html("");
        $.post("/index.php?route
            = module / cart
        ",ajax_cart_loaded)}return false});if($("#blog - overview
        ").length&&$("#blog - overview
        ").data
        ("id")
    )
        {
            var d = $("#blog-overview").data("id");
            if ($('.blog-detail[data-id="' + d + '"]').length) {
                $('a[data-id
                    = "'+d+'"
            ]
                ').click()}else{var a=$('.blog - article[data - id = "'+d+'"]
                ').offset().top;$("html, body").animate
                ({scrollTop: a - 100})
            }
        }
        if ($(".cat-menu").length && $(".cat-menu").is(":visible")) {
            $(window).scroll(function
                () {
                var e = $(".cat-menu").outerHeight();
                if ($(this).scrollTop() == 0) {
                    $(".cat-menu").stop().removeClass("fixed"
                    ).css({top: 0});
                    $(".cat-menu-spacer").hide()
                } else {
                    if ($(this).scrollTop() < last_scrolltop) {
                        if (scrolling_up_since
                            === null) {
                            scrolling_up_since = $(this).scrollTop()
                        }
                        scrolling_down_since = null;
                        if (scrolling_up_since - $(this
                            ).scrollTop() > 300) {
                            if (!$(".cat-menu").hasClass("fixed") && $(this).scrollTop() > 50 + e + 100 && !$("#ajax-cart"
                                ).is(":visible")) {
                                $(".cat-menu").addClass("fixed");
                                $(".cat-menu-spacer").css({height: e}).show();
                                $(".cat-menu"
                                ).css({top: 50 - e}).animate({top: 50})
                            }
                        }
                    } else {
                        scrolling_up_since = null;
                        if (scrolling_down_since === null) {
                            scrolling_down_since
                                = $(this).scrollTop()
                        }
                        if ($(this).scrollTop() - scrolling_down_since > 300 || $(this).scrollTop() == 0) {
                            $(".cat-menu"
                            ).stop().removeClass("fixed").css({top: 0});
                            $(".cat-menu-spacer").hide()
                        }
                    }
                }
                last_scrolltop = $(this).scrollTop
                ()
            })
        }
        if ($(".cat-menu-mobile").length && $(".cat-menu-mobile").is(":visible")) {
            $(window).scroll(function
                () {
                var e = $(".cat-menu-mobile").outerHeight();
                if ($(this).scrollTop() == 0) {
                    $(".cat-menu-mobile").stop()
                        .removeClass("fixed").css({top: 0});
                    $(".cat-menu-spacer").hide()
                } else {
                    if ($(this).scrollTop() < last_scrolltop
                    ) {
                        if (!$(".cat-menu-mobile").hasClass("fixed") && $(this).scrollTop() > 44 + e) {
                            $(".cat-menu-mobile").addClass
                            ("fixed");
                            $(".cat-menu-spacer").css({height: e}).show();
                            $(".cat-menu-mobile").css({top: 44 - e}).animate
                            ({top: 44})
                        }
                    } else {
                        $(".cat-menu-mobile").stop().removeClass("fixed").css({top: 0});
                        $(".cat-menu-spacer"
                        ).hide()
                    }
                }
                last_scrolltop = $(this).scrollTop()
            })
        }
        $("header input[name='search']").parent().find("span"
        ).on("click", function () {
                url = $("base").attr("href") + "index.php?route=product/search";
                var e = $("header input
                    [name = 'search']
                ").val();if(e){url+=" & search = "+encodeURIComponent(e)}location=url});$("
                header
                input[name
                    = 'search']
                ").on("
                keydown
                ",function(f){if(f.keyCode==13){$("
                header
                input[name = 'search']
                ").parent().find
                ("span").trigger("click")
            }
    }
    )
    ;
    $("#cart").on("click", function () {
        $("#cart").load("index.php?route=module
        / cart #cart > * ")});$(".main - navbar.dropdown - menu
        ").each(function(){var f=$(".main - navbar
        ").offset(
        )
        ;
        var g = $(this).parent().offset();
        var e = (g.left + $(this).outerWidth()) - (f.left + $(".main-navbar").outerWidth
            ());
        if (e > 0) {
            $(this).css("margin-left", "-" + (e + 5) + "px")
        }
    });
    $("[data-toggle='tooltip']").tooltip()
});
function
getURLVar(b) {
    var e = [];
    var d = String(document.location).split("?");
    if (d[1]) {
        var a = d[1].split("&");
        for
        (i = 0; i < a.length; i++) {
            var c = a[i].split("=");
            if (c[0] && c[1]) {
                e[c[0]] = c[1]
            }
        }
        if (e[b]) {
            return e[b]
        } else {
            return ""
        }
    }
}
function addToCart(a, b) {
    b = typeof(b) != "undefined" ? b : 1;
    $.ajax({
        url: "index.php?route=checkout/cart/add"
        , type: "post", data: "product_id=" + a + "&quantity=" + b, dataType: "json", success: function (c) {
            $(".alert, .error"
            ).remove();
            if (c.redirect) {
                location = c.redirect
            }
            if (c.success) {
                $("#notification").html('<div class="alert
                alert - success
                ">'+c.success+'<button type="
                button
                " class="
                close
                " data-dismiss="
                alert
                ">&times;</button
                > < / div > ');$(".alert").fadeIn("slow");$("#cart-total").html(c.total);$("html, body").animate({scrollTop
            :
                0
            }
            ,
            "slow"
            )
        }
    }
}
)}
function addToWishList(a) {
    $.ajax({
        url: "index.php?route=account/wishlist/add", type: "post"
        , data: "product_id=" + a, dataType: "json", success: function (b) {
            $(".alert").remove();
            if (b.success) {
                $("#notification"
                ).html('<div class="alert alert-success">' + b.success + '<button type="button" class="close" data-dismiss
                        = "alert" > & times;
            <
                /button></
                div > ');$(".alert").fadeIn("slow");$("#wishlist-total").html(b.total);$("html
                    , body
                ").animate({scrollTop:0},"
                slow
                ")}}})}function addToCompare(a){$.ajax({url:"
                index.php ? route = product
                / compare / add",type:"
                post
                ",data:"
                product_id = "+a,dataType:"
                json
                ",success:function(b){$(".alert
                ").remove
                ();
                if (b.success) {
                    $("#notification").html('<div class="alert alert-success">' + b.success + '<button type
                        = "button"
                class
                    = "close"
                    data - dismiss = "alert" > & times;
                <
                    /button></
                    div > ');$(".alert").fadeIn("slow");$("
#compare_total
                    ").html(b.total);$("
                    html, body
                    ").animate({scrollTop:0},"
                    slow
                    ")}}})}function fix_hero_images
                    ()
                    {
                        if ($(".slideshow").length) {
                            var b = $(window).width();
                            if (b <= 768) {
                                var a = b
                            } else {
                                if (b <= 1920) {
                                    var a = Math
                                        .round(b / (1280 / 680));
                                    if (a > 680) {
                                        a = 680
                                    }
                                } else {
                                    var a = Math.round(b / (1920 / 680))
                                }
                            }
                            $(".slideshow").css({
                                height: a
                            })
                        }
                    }
                    function slide_animations(d) {
                        var a = 20;
                        var c = 0;
                        var b = 300;
                        $(".slide-in:not(.animate):not(.scheduled
                        )
                        ").each(function(){var e=$(window).scrollTop()+$(window).height();if(e>$(this).offset().top+a){if($
                        (this).is("#footer-arrow") && d && e > $(this).offset().top
                    )
                        {
                            $(this).remove()
                        }
                    else
                        {
                            if (d && e - $(window).height
                                () / 10 > $(this).offset().top) {
                                $(this).css("transition", "none");
                                $(this).addClass("animate")
                            } else {
                                if (c > 0
                                    && c <= 10) {
                                    $(this).addClass("scheduled").delay(c * b).queue(function () {
                                        $(this).addClass("animate")
                                    })
                                } else {
                                    $(this).addClass("animate");
                                    if (c > 10) {
                                        $(".scheduled:not(.animate)").stop(true, true).addClass("animate"
                                        )
                                    }
                                }
                                c++
                            }
                        }
                    }
                }
            )
            }
            function blog_slide_animations() {
                var a = 100;
                var c = 0;
                var b = 500;
                $(".blog-slide-in, .blog-slide-in-left
                    ,.blog - slide -in -right
                ").filter("
            :
                not(.animate
            ):
                not(.scheduled
            )
                ").each(function(){var d=$(window).scrollTop
                () + $(window).height();
                if (d > $(this).offset().top + a) {
                    $(this).addClass("animate");
                    c++
                }
            }

            )
            ;
            a = 500;
            if ($("html"
                ).hasClass("touch")) {
                a = 1000
            }
            $(".blog-article[data-style]").each(function () {
                var d = $(window).scrollTop
                    () + $(window).height();
                if (d > $(this).offset().top - a) {
                    $(this).attr("style", $(this).attr("data-style"));
                    $
                    (this).removeAttr("data-style");
                    var e = $(this).data("id");
                    $(".share-images .article" + e + "[data-src]").each
                    (function () {
                        $(this).attr("src", $(this).attr("data-src"));
                        $(this).removeAttr("data-src")
                    })
                }
            })
        }function
            fp_slider(b, a)
    {
        if (typeof a == "undefined") {
            var c = $(b).find("li.active").next("li");
            if (!c.length) {
                c = $(b
                ).find("li:first")
            }
        } else {
            if (a == -1) {
                var c = $(b).find("li.active").prev("li");
                if (!c.length) {
                    c = $(b).find
                    ("li:last")
                }
            } else {
                var c = $(b).find("li").get(a)
            }
        }
        if (!$(b).hasClass("fullscreen-slider") && !$(b).hasClass
            ("modal-slider") && !$(b).hasClass("blog-slider") && !$(b).hasClass("carousel-inner")) {
            $(b).css({
                height: $
                (b).height()
            });
            $(b).find("li").css({position: "absolute", top: 0, left: 0})
        }
        $(b).find("li").not(c).removeClass
        ("active").stop(true).fadeOut(600);
        $(c).addClass("active").stop(true).fadeTo(800, 1, function () {
                if (!$(b
                    ).hasClass("fullscreen-slider") && !$(b).hasClass("modal-slider") && !$(b).hasClass("blog-slider") && !$(b
                    ).hasClass("carousel-inner")) {
                    $(b).css({height: "auto"});
                    $(b).find("li").css({position: "relative"})
                }
            }
        )
    }
    function fullscreen_slider() {
        $("html, body").css("overflow-y", "hidden");
        $("body").append('<div class
            = "fullscreen-slider fp-slider" > < ul > < /ul></
        div > ');var c=$(".product-images li.active").index();var b=0
        ;
        $(".product-images li").each(function () {
            var e = $(this).find("a").attr("href");
            var d = $('<li><img src="'
            + e + '"></li>');
            $(".fullscreen-slider ul").append(d);
            if (b == c) {
                $(d).addClass("active").show()
            } else {
                $(d)
                    .hide()
            }
            b++
        });
        if ($(".product-images li").length > 1) {
            $(".fullscreen-slider").append('<div class="arrow-left"
            > < /div><div class="arrow-right"></
            div > ')}$(".fullscreen-slider .arrow-left").click(function(){var d=$
            (this).closest(".fp-slider");
            fp_slider(d, -1);
            $(".product-images .arrow-left").click()
        }
    )
        ;
        $(".fullscreen-slider
            .arrow - right
        ").click(function(){var d=$(this).closest(".fp - slider
        ");fp_slider(d);$(".product - images
            .arrow - right
        ").click()});$(".fullscreen - slider
        ul
        ").click(function(){$(".fullscreen - slider
        ").remove
        ();
        $("html, body").css("overflow-y", "auto")
    }

)
    ;
    if (!$("html").hasClass("touch")) {
        $(".fullscreen-slider"
        ).mousemove(function (g) {
                var f = this;
                var d = 1 - ((g.pageY - $(f).offset().top) / ($(f).height() - 20));
                $(".fullscreen-slider
                li:visible
                img
                ").each(function(){if($(f).height()<$(this).height()){if(d<0){d=0}if(d>1){d=1}var h=0
                ;
                var e = $(f).height() - $(this).height();
                $(this).css("top", (h - e) * d + e)
            }
    else
        {
            var j = Math.round(($(f).height
            () - $(this).height()) / 2);
            $(this).css("top", j)
        }
    }
)
}
)}else
{
    var a = 2000;
    $(".fullscreen-slider li img").css
    ({left: -Math.round((a - $(window).width()) / 2), top: -Math.round((a - $(window).height()) / 2)});
    $(".fullscreen-slider"
    ).append('<a href="#" class="close-window"></a>');
    $(".fullscreen-slider .close-window").click(function
        () {
        $(".fullscreen-slider").remove();
        $("html, body").css("overflow-y", "auto");
        return false
    });
    $(".fullscreen-slider"
    ).on("touchstart", function (d) {
            last_touch_x = d.originalEvent.touches[0].clientX;
            last_touch_y = d.originalEvent
                .touches[0].clientY
        }).on("touchmove", function (l) {
            var h = $(".fullscreen-slider li:visible img").width(
                ) - $(window).width();
            var g = $(".fullscreen-slider li:visible img").height() - $(window).height();
            var f = (
                (l.originalEvent.touches[0].clientX - last_touch_x) / $(window).width()) * h;
            var d = ((l.originalEvent.touches
                    [0].clientY - last_touch_y) / $(window).height()) * g;
            var k = parseInt($(".fullscreen-slider li:visible img"
            ).css("left"));
            var j = parseInt($(".fullscreen-slider li:visible img").css("top"));
            k += f;
            j += d;
            if (k > 0) {
                k
                    = 0
            }
            if (j > 0) {
                j = 0
            }
            if (k < -h) {
                k = -h
            }
            if (j < -g) {
                j = -g
            }
            $(".fullscreen-slider li:visible img").css({left: k, top: j}
            );
            last_touch_x = l.originalEvent.touches[0].clientX;
            last_touch_y = l.originalEvent.touches[0].clientY;
            l.preventDefault
            ()
        })
}
}
function modal_slider() {
    $(".blog-detail:visible .inner").append('<div class="modal-slider fp-slider"
    > < ul > < /ul></
    div > ');var b=$(".blog-slider:visible li.active").index();var a=0;$(".blog-slider:visible
    li
    ").each(function(){var d=$(this).find("
    a
    ").attr("
    href
    ");var c=$('<li><img src="
    '+d+'
    "></li>');$("
        .modal - slider
    ul
    ").append(c);if(a==b){$(c).addClass("
    active
    ").show()}else{$(c).hide()}a++});if($(".blog - slider
:
    visible
    li
    ").length>1){$(".modal - slider
    ").append('<div class="
    arrow - left
    "></div><div class="
    arrow - right
    "
    > < / div > ')}$(".modal-slider .arrow-left").click(function(){var c=$(this).closest(".fp-slider");fp_slider
    (c, -1);
    $(".blog-slider .arrow-left").click()
}
)
;
$(".modal-slider .arrow-right").click(function () {
    var c
        = $(this).closest(".fp-slider");
    fp_slider(c);
    $(".blog-slider .arrow-right").click()
});
$(".modal-slider
ul
").click(function(){$(".modal - slider
").remove()});if(!$("
html
").hasClass("
touch
")){$(".modal - slider
"
).
mousemove(function (f) {
    var d = this;
    var c = 1 - ((f.pageY - $(d).offset().top) / ($(d).height() - 20));
    $(".modal-slider
    li:visible
    img
    ").each(function(){if($(d).height()<$(this).height()){if(c<0){c=0}if(c>1){c=1}var g=0
    ;
    var e = $(d).height() - $(this).height() + 1;
    $(this).css("top", Math.round((g - e) * c + e))
}
else
{
    var h = Math.round
    (($(d).height() - $(this).height()) / 2);
    $(this).css("top", h)
}
})})}else
{
    $(".modal-slider").on("touchstart"
        , function (c) {
            last_touch_y = c.originalEvent.touches[0].clientY
        }).on("touchmove", function (g) {
            var d = $(".modal-slider
            li:visible
            img
            ").height()-$(".modal - slider
            ").height();var c=((g.originalEvent.touches[0].clientY-last_touch_y
            )/
            $(".modal-slider").height()
            )*
            d;
            var f = parseInt($(".modal-slider li:visible img").css("top"));
            f += c;
            if
            (f > 0) {
                f = 0
            }
            if (f < -d) {
                f = -d
            }
            $(".modal-slider li:visible img").css({top: f});
            last_touch_y = g.originalEvent.touches
                [0].clientY;
            g.preventDefault()
        })
}
}
function start_search() {
    $(window).scrollTop(0);
    $("#search-desktop"
    ).show();
    $("#search-desktop").nextAll(".container, div.slideshow, div.cat-menu, #map-canvas").each(function
        () {
        $(this).addClass("hidden-search")
    });
    $("#ajax-cart, #ajax-cart-placeholder").hide();
    $("#search-desktop
        .search - field
    ").focus()}function perform_search(){var b=$(".search - field
    ").val();if(b.length>1){var
    e = "";
    if ($("#search-desktop .filters div[data-filter=collections] li.active").length) {
        e = $("#search-desktop
            .filters
        div[data - filter = collections]
        li.active
        ").data("
        id
        ")}var d="
        ";if($("#search - desktop.filters
        div[data - filter = fabrics]
        li.active
        ").length){d=$("#search - desktop.filters
        div[data - filter = fabrics]
        li.active
        ").data("
        id
        ")}var c="
        ";if($("#search - desktop.filters
        div[data - filter = categories]
        li.active
        "
    ).
        length
    )
        {
            c = $("#search-desktop .filters div[data-filter=categories] li.active").data("id")
        }
        var a = "";
        if
        ($("#search-desktop .filters div[data-filter=colors] li.active").length) {
            a = $("#search-desktop .filters
            div[data - filter = colors]
            li.active
            ").data("
            id
            ")}$.post(" / index.php ? route = product / search / ajax",{search
        :
            b, collection
        :
            e, fabric
        :
            d, category
        :
            c, color
        :
            a
        }
    ,
        function (f) {
            $("#search-desktop .results").html(f);
            $("#search-desktop
                .results.filters
            li
            ").click(function(){$(this).toggleClass("
            active
            ");if($(this).hasClass("
            active
            ")
        )
            {
                $(this).closest("ul").find("li").not(this).removeClass("active")
            }
            perform_search()
        }

    )
        ;
        $("#search-desktop
            .results.filters
        a.reset - filters
        ").click(function(){$("#search - desktop.results.filters
        li
        ").removeClass
        ("active");
        perform_search();
        return false
    }
)
}
)}}
function custom_checkboxes() {
    if (navigator.appVersion.match
        (/MSIE [\d]+/) != "MSIE 8") {
        $("input[type=radio],input[type=checkbox]").filter(":not(.replaced)").each
        (function () {
            var a = $(this).attr("type");
            var c = $('<div class="custom-' + a + '" />');
            var b = this;
            $(c).click
            (function () {
                $(b).click()
            });
            if ($(this).is(":checked")) {
                $(c).addClass("checked")
            }
            $(this).after(c);
            $(this
            ).addClass("replaced").hide()
        })
    }
}
function show_size_info() {
    $(".size-window, .size-window-overlay").show
    ();
    if ($(window).scrollTop() > $(".size-window").offset().top) {
        $(window).scrollTop($(".size-window").offset
        ().top)
    }
    return false
}
var reload_cart = function (a) {
    $("#ajax-cart").attr("data-reload", "true");
    $.post("
    / index.php ? route = module / cart",a,ajax_cart_loaded)};var reload_cart_mobile=function(a){a.mobile=true;$
        .post("/index.php?route=module/cart", a, ajax_cart_loaded_mobile)
};
var ajax_cart_loaded = function (a) {
    $(".cat - menu").stop().removeClass("fixed").css({top:0});$(".cat - menu - spacer").hide();$("#ajax - cart.container" ).html(a);
    custom_checkboxes();
    if (!$("#ajax-cart").attr("data-reload")) {
        $("#ajax-cart, #ajax-cart-placeholder"
        ).css({height: 0, paddingTop: 0, paddingBottom: 0}).show();
        $("#ajax-cart, #ajax-cart-placeholder").stop()
            .animate({
                height: $("#ajax-cart .container").outerHeight() + 64,
                paddingTop: 30,
                paddingBottom: 30,
                marginBottom: 30
            }, 400, function () {
                $("#ajax-cart").css({height: "auto"});
                $("#ajax-cart-placeholder").css({height: $("#ajax - cart
                ").outerHeight()})})}$("#ajax - cart
                ").removeAttr("
                data - reload
                ");$(".cart - button, header.cart - products
                "
                ).
                text($("input[name=cart-products]").val());
                $("#ajax-cart .close-window").click(function () {
                    ajax_cart_hide
                    ();
                    return false
                });
                $("#ajax-cart .product a.delete").click(function () {
                    var c = $(this).closest(".product"
                    ).data("key");
                    var d = parseInt($(this).closest(".product").data("quantity")) - 1;
                    if (d == 0) {
                        reload_cart({
                            remove: c
                        })
                    } else {
                        var b = {};
                        b[c] = d;
                        reload_cart({quantity: b})
                    }
                    return false
                });
                $("#ajax-cart .coupon input[type=checkbox
                ]
                ").change(function(){if($(this).is("
                :
                checked
                ")){if(!$("#ajax - cart.coupon
                input[type = text]
                ").is("
                :
                focus
                "
                ))
                {
                    $("#ajax-cart .coupon input[type=text]").focus()
                }
                $("#ajax-cart .coupon input[type=button]").show(
                )
            }
    else
        {
            $("#ajax-cart .coupon input[type=button]").hide()
        }
    }
    )
    ;
    $("#ajax-cart .coupon input[type=text]")
        .keypress(function (b) {
            if (b.keyCode == 13 && $(this).val()) {
                reload_cart({advanced_coupon: $(this).val()})
            }
        });
    $("#ajax-cart .coupon input[type=text]").focus(function () {
        $("#ajax-cart .coupon input[type=button
        ]
        ").show();$("#ajax - cart.coupon
        input[type = checkbox]
        ").attr("
        checked
        ","
        checked
        ")});$("#ajax - cart.coupon
        input[type = button]
        ").click(function(){if($("#ajax - cart.coupon
        input[type = text]
        ").val()){reload_cart
        ({advanced_coupon: $("#ajax-cart .coupon input[type=text]").val()})
    }
}
)}
;
var ajax_cart_loaded_mobile = function
    (a) {
    $("#ajax-cart-mobile .inner").html(a);
    custom_checkboxes();
    $(".cart-button, header .cart-products"
    ).text($("input[name=cart-products]").val());
    $("#ajax-cart-mobile .products").css("height", $("#ajax-cart-mobile"
    ).height() - $("#ajax-cart-mobile .summary").outerHeight(true) - $("#ajax-cart-mobile h2").outerHeight(true
    ));
    $("#ajax-cart-mobile .product .delete").click(function () {
        var b = $(this).closest(".product").data("key"
        );
        reload_cart_mobile({remove: b});
        return false
    });
    $("#ajax-cart-mobile .product .quantity a").click(function
        () {
        var c = $(this).closest(".product").data("key");
        var d = parseInt($(this).closest(".quantity").find("span"
        ).text());
        if ($(this).hasClass("increase")) {
            d += 1
        } else {
            d -= 1
        }
        if (d == 0) {
            reload_cart_mobile({remove: c})
        } else {
            var b = {};
            b[c] = d;
            reload_cart_mobile({quantity: b})
        }
        return false
    });
    $("#ajax-cart-mobile input[type=checkbox
    ]
    ").change(function(){if($(this).is("
    :
    checked
    ")){$("#ajax - cart - mobile.coupon
    input[type = text]
    ").focus
    ()
}
})
;
$("#ajax-cart-mobile input[type=text]").keypress(function (b) {
    if (b.keyCode == 13 && $(this).val()) {
        reload_cart_mobile
        ({advanced_coupon: $(this).val()})
    }
});
$("#ajax-cart-mobile input[type=text]").blur(function () {
    if ($(this
        ).val()) {
        reload_cart_mobile({advanced_coupon: $(this).val()})
    }
});
$("#ajax-cart-mobile .products").on("touchstart"
    , function (b) {
        last_touch = b.originalEvent.touches[0].clientY
    }).on("touchmove", function (c) {
        var b = $(this
            ).find(".products-inner").height() - $(this).height();
        if (c.originalEvent.touches[0].clientY > last_touch
        ) {
            if ($(this).scrollTop() <= 0) {
                c.preventDefault()
            }
        } else {
            if (c.originalEvent.touches[0].clientY < last_touch
            ) {
                if ($(this).scrollTop() >= b) {
                    c.preventDefault()
                }
            } else {
                c.preventDefault()
            }
        }
        last_touch = c.originalEvent
            .touches[0].clientY
    })
}
;
var mobile_menu_hide = function () {
    $("#mobile-overlay").hide();
    var a = $("#mobile-menu"
    ).width();
    $("#mobile-menu").animate({left: -a}, 300, function () {
        $("#mobile-menu").hide()
    })
};
var ajax_cart_hide
    = function () {
    var a = $("#ajax-cart, #ajax-cart-placeholder").outerHeight();
    $("#ajax-cart, #ajax-cart-placeholder"
    ).stop().css({height: a}).animate({height: 0}, 300, function () {
            $("#ajax-cart, #ajax-cart-placeholder").hide
            ()
        })
};
var ajax_cart_mobile_hide = function () {
    $("#mobile-overlay").hide();
    var a = $("#ajax-cart-mobile").width();
    $("#ajax-cart-mobile").animate({right: -a}, 300, function () {
        $("#ajax-cart-mobile").hide()
    })
};