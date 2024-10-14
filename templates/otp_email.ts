function html(params: { OTP: string, SITE: string }) {
    const { OTP, SITE } = params

    return `
    <!doctype html>
<html ⚡4email data-css-strict>

<head>
    <meta charset="utf-8">
    <style amp4email-boilerplate>
        body {
            visibility: hidden
        }
    </style>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <style amp-custom>
        .es-desk-hidden {
            display: none;
            float: left;
            overflow: hidden;
            width: 0;
            max-height: 0;
            line-height: 0;
        }

        body {
            width: 100%;
            font-family: Poppins, sans-serif;
        }

        table {
            border-collapse: collapse;
            border-spacing: 0px;
        }

        table td,
        body,
        .es-wrapper {
            padding: 0;
            Margin: 0;
        }

        .es-content,
        .es-header,
        .es-footer {
            table-layout: fixed;
            width: 100%;
        }

        p,
        hr {
            Margin: 0;
        }

        h1,
        h2,
        h3,
        h4,
        h5 {
            Margin: 0;
            line-height: 120%;
            font-family: Poppins, sans-serif;
        }

        .es-left {
            float: left;
        }

        .es-right {
            float: right;
        }

        .es-p5 {
            padding: 5px;
        }

        .es-p5t {
            padding-top: 5px;
        }

        .es-p5b {
            padding-bottom: 5px;
        }

        .es-p5l {
            padding-left: 5px;
        }

        .es-p5r {
            padding-right: 5px;
        }

        .es-p10 {
            padding: 10px;
        }

        .es-p10t {
            padding-top: 10px;
        }

        .es-p10b {
            padding-bottom: 10px;
        }

        .es-p10l {
            padding-left: 10px;
        }

        .es-p10r {
            padding-right: 10px;
        }

        .es-p15 {
            padding: 15px;
        }

        .es-p15t {
            padding-top: 15px;
        }

        .es-p15b {
            padding-bottom: 15px;
        }

        .es-p15l {
            padding-left: 15px;
        }

        .es-p15r {
            padding-right: 15px;
        }

        .es-p20 {
            padding: 20px;
        }

        .es-p20t {
            padding-top: 20px;
        }

        .es-p20b {
            padding-bottom: 20px;
        }

        .es-p20l {
            padding-left: 20px;
        }

        .es-p20r {
            padding-right: 20px;
        }

        .es-p25 {
            padding: 25px;
        }

        .es-p25t {
            padding-top: 25px;
        }

        .es-p25b {
            padding-bottom: 25px;
        }

        .es-p25l {
            padding-left: 25px;
        }

        .es-p25r {
            padding-right: 25px;
        }

        .es-p30 {
            padding: 30px;
        }

        .es-p30t {
            padding-top: 30px;
        }

        .es-p30b {
            padding-bottom: 30px;
        }

        .es-p30l {
            padding-left: 30px;
        }

        .es-p30r {
            padding-right: 30px;
        }

        .es-p35 {
            padding: 35px;
        }

        .es-p35t {
            padding-top: 35px;
        }

        .es-p35b {
            padding-bottom: 35px;
        }

        .es-p35l {
            padding-left: 35px;
        }

        .es-p35r {
            padding-right: 35px;
        }

        .es-p40 {
            padding: 40px;
        }

        .es-p40t {
            padding-top: 40px;
        }

        .es-p40b {
            padding-bottom: 40px;
        }

        .es-p40l {
            padding-left: 40px;
        }

        .es-p40r {
            padding-right: 40px;
        }

        .es-menu td {
            border: 0;
        }

        s {
            text-decoration: line-through;
        }

        p,
        ul li,
        ol li {
            font-family: Poppins, sans-serif;
            line-height: 150%;
        }

        ul li,
        ol li {
            Margin-bottom: 15px;
            margin-left: 0;
        }

        a {
            text-decoration: underline;
        }

        .es-menu td a {
            text-decoration: none;
            display: block;
            font-family: Poppins, sans-serif;
        }

        .es-menu img,
        .es-button img {
            vertical-align: middle;
        }

        .es-wrapper {
            width: 100%;
            height: 100%;
        }

        .es-wrapper-color,
        .es-wrapper {
            background-color: #FFFFFF;
        }

        .es-header {
            background-color: transparent;
        }

        .es-header-body {
            background-color: #FFFFFF;
        }

        .es-header-body p,
        .es-header-body ul li,
        .es-header-body ol li {
            color: #5D541D;
            font-size: 14px;
        }

        .es-header-body a {
            color: #5D541D;
            font-size: 14px;
        }

        .es-content-body {
            background-color: #FAD939;
        }

        .es-content-body p,
        .es-content-body ul li,
        .es-content-body ol li {
            color: #5D541D;
            font-size: 18px;
        }

        .es-content-body a {
            color: #5D541D;
            font-size: 18px;
        }

        .es-footer {
            background-color: transparent;
        }

        .es-footer-body {
            background-color: #333333;
        }

        .es-footer-body p,
        .es-footer-body ul li,
        .es-footer-body ol li {
            color: #FFFFFF;
            font-size: 14px;
        }

        .es-footer-body a {
            color: #FFFFFF;
            font-size: 14px;
        }

        .es-infoblock,
        .es-infoblock p,
        .es-infoblock ul li,
        .es-infoblock ol li {
            line-height: 120%;
            font-size: 12px;
            color: #CCCCCC;
        }

        .es-infoblock a {
            font-size: 12px;
            color: #CCCCCC;
        }

        h1 {
            font-size: 38px;
            font-style: normal;
            font-weight: bold;
            color: #5D541D;
        }

        h2 {
            font-size: 24px;
            font-style: normal;
            font-weight: bold;
            color: #5D541D;
        }

        h3 {
            font-size: 20px;
            font-style: normal;
            font-weight: bold;
            color: #5D541D;
        }

        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
            font-size: 38px;
        }

        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
            font-size: 24px;
        }

        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
            font-size: 20px;
        }

        a.es-button,
        button.es-button {
            padding: 15px 35px 15px 35px;
            display: inline-block;
            background: #660099;
            border-radius: 30px;
            font-size: 16px;
            font-family: Poppins, sans-serif;
            font-weight: normal;
            font-style: normal;
            line-height: 120%;
            color: #FFFFFF;
            text-decoration: none;
            width: auto;
            text-align: center;
        }

        .es-button-border {
            border-style: solid solid solid solid;
            border-color: #2CB543 #2CB543 #2CB543 #2CB543;
            background: #660099;
            border-width: 0px 0px 0px 0px;
            display: inline-block;
            border-radius: 30px;
            width: auto;
        }

        body {
            font-family: arial, "helvetica neue", helvetica, sans-serif;
        }

        @media only screen and (max-width:600px) {

            p,
            ul li,
            ol li,
            a {
                line-height: 150%
            }

            h1,
            h2,
            h3,
            h1 a,
            h2 a,
            h3 a {
                line-height: 120%
            }

            h1 {
                font-size: 30px;
                text-align: center
            }

            h2 {
                font-size: 24px;
                text-align: center
            }

            h3 {
                font-size: 20px;
                text-align: center
            }

            .es-header-body h1 a,
            .es-content-body h1 a,
            .es-footer-body h1 a {
                font-size: 30px;
                text-align: center
            }

            .es-header-body h2 a,
            .es-content-body h2 a,
            .es-footer-body h2 a {
                font-size: 24px;
                text-align: center
            }

            .es-header-body h3 a,
            .es-content-body h3 a,
            .es-footer-body h3 a {
                font-size: 20px;
                text-align: center
            }

            .es-menu td a {
                font-size: 14px
            }

            .es-header-body p,
            .es-header-body ul li,
            .es-header-body ol li,
            .es-header-body a {
                font-size: 14px
            }

            .es-content-body p,
            .es-content-body ul li,
            .es-content-body ol li,
            .es-content-body a {
                font-size: 14px
            }

            .es-footer-body p,
            .es-footer-body ul li,
            .es-footer-body ol li,
            .es-footer-body a {
                font-size: 14px
            }

            .es-infoblock p,
            .es-infoblock ul li,
            .es-infoblock ol li,
            .es-infoblock a {
                font-size: 12px
            }

            *[class="gmail-fix"] {
                display: none
            }

            .es-m-txt-c,
            .es-m-txt-c h1,
            .es-m-txt-c h2,
            .es-m-txt-c h3 {
                text-align: center
            }

            .es-m-txt-r,
            .es-m-txt-r h1,
            .es-m-txt-r h2,
            .es-m-txt-r h3 {
                text-align: right
            }

            .es-m-txt-l,
            .es-m-txt-l h1,
            .es-m-txt-l h2,
            .es-m-txt-l h3 {
                text-align: left
            }

            .es-m-txt-r img {
                float: right
            }

            .es-m-txt-c img {
                margin: 0 auto
            }

            .es-m-txt-l img {
                float: left
            }

            .es-button-border {
                display: inline-block
            }

            a.es-button,
            button.es-button {
                font-size: 18px;
                display: inline-block
            }

            .es-adaptive table,
            .es-left,
            .es-right {
                width: 100%
            }

            .es-content table,
            .es-header table,
            .es-footer table,
            .es-content,
            .es-footer,
            .es-header {
                width: 100%;
                max-width: 600px
            }

            .es-adapt-td {
                display: block;
                width: 100%
            }

            .adapt-img {
                width: 100%;
                height: auto
            }

            td.es-m-p0 {
                padding: 0px
            }

            td.es-m-p0r {
                padding-right: 0px
            }

            td.es-m-p0l {
                padding-left: 0px
            }

            td.es-m-p0t {
                padding-top: 0px
            }

            td.es-m-p0b {
                padding-bottom: 0
            }

            td.es-m-p20b {
                padding-bottom: 20px
            }

            .es-mobile-hidden,
            .es-hidden {
                display: none
            }

            tr.es-desk-hidden,
            td.es-desk-hidden,
            table.es-desk-hidden {
                width: auto;
                overflow: visible;
                float: none;
                max-height: inherit;
                line-height: inherit
            }

            tr.es-desk-hidden {
                display: table-row
            }

            table.es-desk-hidden {
                display: table
            }

            td.es-desk-menu-hidden {
                display: table-cell
            }

            .es-menu td {
                width: 1%
            }

            table.es-table-not-adapt,
            .esd-block-html table {
                width: auto
            }

            table.es-social {
                display: inline-block
            }

            table.es-social td {
                display: inline-block
            }

            .es-desk-hidden {
                display: table-row;
                width: auto;
                overflow: visible;
                max-height: inherit
            }
        }
    </style>
</head>

<body>
    <div class="es-wrapper-color">
        <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#ffffff"></v:fill> </v:background><![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td valign="top">
                    <table cellpadding="0" cellspacing="0" class="es-header" align="center">
                        <tr>
                            <td align="center">
                                <table bgcolor="#fad939" class="es-header-body" align="center" cellpadding="0"
                                    cellspacing="0" width="510">
                                    <tr>
                                        <td class="es-p20r es-p20l" align="left">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td width="470" align="center" valign="top">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="center" height="40"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table class="es-content" cellspacing="0" cellpadding="0" align="center">
                        <tr>
                            <td align="center">
                                <table class="es-content-body" style="background-color: transparent" width="510"
                                    cellspacing="0" cellpadding="0" align="center" bgcolor="#FAD939">
                                    <tr>
                                        <td align="left">
                                            <table width="100%" cellspacing="0" cellpadding="0">
                                                <tr>
                                                    <td class="es-m-p0r" width="510" valign="top" align="center">
                                                        <table width="100%" cellspacing="0" cellpadding="0"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="center" style="position: relative"><img
                                                                        class="adapt-img"
                                                                        src="https://agdcof.stripocdn.email/content/guids/bannerImgGuid/images/image16879509987337482.png"
                                                                        alt title width="510" style="display: block"
                                                                        height="299" layout="responsive"></img></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                        <tr>
                            <td align="center">
                                <table bgcolor="#eed9cc" class="es-content-body" align="center" cellpadding="0"
                                    cellspacing="0" width="510"
                                    style="border-radius: 0px 0px 50px 50px;background-color: #eed9cc">
                                    <tr>
                                        <td class="es-p20r es-p20l" align="left">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td width="470" align="center" valign="top">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="center" bgcolor="#ffffff">
                                                                    <p
                                                                        style="font-size: 50px;font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace;color: #000000">
                                                                        -${OTP}-</p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <h1 style="color: #5d541d">Please confirm<br> email address</h1>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" class="es-p40t es-p40b">
                                                                    <h3>Thanks for joining ${SITE}!</h3>
                                                                    <p><br></p>
                                                                    <p>To finish signing in, please enter your OTP to confirm your email
                                                                        address. This ensures we have the right email in
                                                                        case we need to contact you and also keeps your
                                                                        account secure.</p>
                                                                </td>
                                                            </tr>
                                                            {{!-- <tr>
                                                                <td align="center">
                                                                    <!--[if mso]><a href="https://chouhanrugs.com/signin/verify" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://chouhanrugs.com/signin/verify" style="height:49px; v-text-anchor:middle; width:272px" arcsize="50%" stroke="f" fillcolor="#964c2c"> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family:Poppins, sans-serif; font-size:16px; font-weight:400; line-height:16px; mso-text-raise:1px'>Confirm email address</center> </v:roundrect></a><![endif]-->
                                                                    <!--[if !mso]><!-- --><span
                                                                        class="msohide es-button-border"
                                                                        style="background: #964c2c"><a
                                                                            href="https://chouhanrugs.com/signin/verify"
                                                                            class="es-button" target="_blank"
                                                                            style="background: #964c2c">Confirm email
                                                                            address</a></span> <!--<![endif]--></td>
                                                            </tr> --}}
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="es-p20t es-p40b es-p20r es-p20l" align="left">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td width="470" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="center">
                                                                    <p style="font-size: 14px">Thanks,<br>${SITE}
                                                                        Team!&nbsp;</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" class="es-header" align="center">
                        <tr>
                            <td align="center">
                                <table bgcolor="#fad939" class="es-header-body" align="center" cellpadding="0"
                                    cellspacing="0" width="510">
                                    <tr>
                                        <td class="es-p20r es-p20l" align="left">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td width="470" align="center" valign="top">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="center" height="40"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" class="es-footer" align="center">
                        <tr>
                            <td align="center">
                                <table bgcolor="#eed9cc" class="es-footer-body" align="center" cellpadding="0"
                                    cellspacing="0" width="510" style="border-radius: 50px;background-color: #eed9cc">
                                    <tr>
                                        <td class="es-p20t es-p20b es-p20r es-p20l" align="left">
                                            <!--[if mso]><table width="470" cellpadding="0" cellspacing="0"><tr><td width="225" valign="top"><![endif]-->
                                            <table cellpadding="0" cellspacing="0" class="es-left" align="left">
                                                <tr>
                                                    <td width="225" class="es-m-p20b" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="left" class="es-m-txt-c"
                                                                    style="font-size: 0px"><a target="_blank"
                                                                        href="https://chouhanrugs.com"><img
                                                                            src="https://agdcof.stripocdn.email/content/guids/CABINET_2308b38ed4cd7a47a33169680d9d9b0de95b8e83a89da8f46e433d7402e39f27/images/f540cf5f57ad8b9ea9b8b6700.png"
                                                                            alt="Logo" style="display: block"
                                                                            height="50" title="Logo"
                                                                            width="134"></img></a></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            <!--[if mso]></td><td width="20"></td><td width="225" valign="top"><![endif]-->
                                            <table cellpadding="0" cellspacing="0" class="es-right" align="right">
                                                <tr>
                                                    <td width="225" align="left">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="right" class="es-m-txt-c es-p10t"
                                                                    style="font-size:0">
                                                                    <table cellpadding="0" cellspacing="0"
                                                                        class="es-table-not-adapt es-social"
                                                                        role="presentation">
                                                                        <tr>
                                                                            <td align="center" valign="top"
                                                                                class="es-p10r"><a target="_blank"
                                                                                    href="https://www.facebook.com/Chouhanrugs/"><img
                                                                                        src="https://agdcof.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png"
                                                                                        alt="Fb" title="Facebook"
                                                                                        width="32"
                                                                                        height="32"></img></a></td>
                                                                            <td align="center" valign="top"
                                                                                class="es-p10r"><a target="_blank"
                                                                                    href="https://twitter.com/chouhan_rugs"><img
                                                                                        src="https://agdcof.stripocdn.email/content/assets/img/social-icons/logo-colored/twitter-logo-colored.png"
                                                                                        alt="Tw" title="Twitter"
                                                                                        width="32"
                                                                                        height="32"></img></a></td>
                                                                            <td align="center" valign="top"
                                                                                class="es-p10r"><a target="_blank"
                                                                                    href="https://www.instagram.com/chouhanrugs/"><img
                                                                                        src="https://agdcof.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png"
                                                                                        alt="Ig" title="Instagram"
                                                                                        width="32"
                                                                                        height="32"></img></a></td>
                                                                            <td align="center" valign="top"><a
                                                                                    target="_blank"
                                                                                    href="https://www.youtube.com/channel/UCU7s9m_2gtvqar9Ob5FD8zA"><img
                                                                                        src="https://agdcof.stripocdn.email/content/assets/img/social-icons/logo-colored/youtube-logo-colored.png"
                                                                                        alt="Yt" title="Youtube"
                                                                                        width="32"
                                                                                        height="32"></img></a></td>
                                                                        </tr>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table> <!--[if mso]></td></tr></table><![endif]-->
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" class="es-content" align="center">
                        <tr>
                            <td align="center">
                                <table class="es-content-body" align="center" cellpadding="0" cellspacing="0"
                                    width="510" style="border-radius: 50px;background-color: transparent">
                                    <tr>
                                        <td class="es-p20t es-p20r es-p20l" align="left">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td width="470" align="center" valign="top">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="center" class="es-infoblock">
                                                                    <p>Unsubscribe</p>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table cellpadding="0" cellspacing="0" class="es-header" align="center">
                        <tr>
                            <td align="center">
                                <table bgcolor="#fad939" class="es-header-body" align="center" cellpadding="0"
                                    cellspacing="0" width="510">
                                    <tr>
                                        <td class="es-p20r es-p20l" align="left">
                                            <table cellpadding="0" cellspacing="0" width="100%">
                                                <tr>
                                                    <td width="470" align="center" valign="top">
                                                        <table cellpadding="0" cellspacing="0" width="100%"
                                                            role="presentation">
                                                            <tr>
                                                                <td align="center" height="40"></td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>
    `
}