<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns="http://www.w3.org/1999/xhtml" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sxml="http://sergets.ru/sxml"
    xmlns:exsl="http://exslt.org/common">

    <xsl:include href="point-comments.xsl"/>
    <xsl:output media-type="text/html" method="html"
          omit-xml-declaration="yes"
          doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
          doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
    
    <xsl:template name="point">
        <xsl:param name="name"/>
        <xsl:param name="q"/>
        <xsl:param name="descr"/>
        <xsl:param name="marker"/>
        <xsl:param name="comments"/>
        <xsl:param name="photos"/>
        <xsl:param name="node"/>
        <!-- TODO: param name="permit-..." -->

        <xsl:call-template name="rich-map-object-form">
            <xsl:with-param name="name" select="$name"/>
            <xsl:with-param name="marker" select="$marker"/>
            <xsl:with-param name="title-placeholder" select="'Краткое название точки'"/>
            <xsl:with-param name="comments" select="$comments"/>
            <xsl:with-param name="photos" select="$photos"/>
            <xsl:with-param name="node-for-data" select="$node"/>
            <xsl:with-param name="content">
                <xsl:call-template name="inplace-textarea">
                    <xsl:with-param name="class" select="'text'"/>
                    <xsl:with-param name="val" select="$descr"/>
                    <xsl:with-param name="placeholder" select="'Описание точки, комментарий'"/>
                </xsl:call-template>
                <xsl:call-template name="inplace-textarea">
                    <xsl:with-param name="class" select="'question'"/>
                    <xsl:with-param name="val" select="$q"/>
                    <xsl:with-param name="placeholder" select="'Варианты вопроса на местности c ответами'"/>
                </xsl:call-template>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>
    
    <!-- Matching templates -->
    
    <xsl:template match="point" mode="sxml:js">point : {
        id : '<xsl:apply-templates select="@sxml:item-id" mode="sxml:quote"/>',
        empty : '<xsl:apply-templates select="@empty" mode="sxml:quote"/>',
        mapId : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="generate-id(.)"/></xsl:call-template>',
        photos : '<xsl:apply-templates select="photos" mode="sxml:quote"/>',
        marker : '<xsl:choose>
            <xsl:when test="@marker"><xsl:apply-templates select="@marker" mode="sxml:quote"/></xsl:when>
            <xsl:otherwise>point11</xsl:otherwise>
        </xsl:choose>'
    }</xsl:template>
    
    <xsl:template match="point" mode="role.map">
        <xsl:variable name="photocount"><xsl:call-template name="sxml:count">
            <xsl:with-param name="haystack" select="photos"/>
            <xsl:with-param name="needle" select="' '"/>
        </xsl:call-template></xsl:variable>
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role" select="'map'"/>
                <xsl:with-param name="class" select="'point'"/>
                <xsl:with-param name="js">
                    map: {
                        lat : '<xsl:apply-templates select="@lat" mode="sxml:quote"/>',
                        lon : '<xsl:apply-templates select="@lon" mode="sxml:quote"/>',
                        icon : '<xsl:choose>
                            <xsl:when test="@marker"><xsl:apply-templates select="@marker" mode="sxml:quote"/></xsl:when>
                            <xsl:otherwise>point11</xsl:otherwise>
                        </xsl:choose>',
                        hint : '<xsl:apply-templates select="name" mode="sxml:quote"/><xsl:if
                            test="photos or thread/messages/msg"> (<xsl:if
                                test="photos"><xsl:call-template name="sxml:incline">
                                    <xsl:with-param name="number" select="$photocount + 1"/>
                                    <xsl:with-param name="one">фотка</xsl:with-param>
                                    <xsl:with-param name="few">фотки</xsl:with-param>
                                    <xsl:with-param name="many">фоток</xsl:with-param>
                                </xsl:call-template></xsl:if><xsl:if
                                test="photos and thread/messages/msg">, </xsl:if><xsl:if
                                test="thread/messages/msg"><xsl:call-template name="sxml:incline">
                                    <xsl:with-param name="number" select="thread/messages/@sxml:total"/>
                                    <xsl:with-param name="one">ответ</xsl:with-param>
                                    <xsl:with-param name="few">ответа</xsl:with-param>
                                    <xsl:with-param name="many">ответов</xsl:with-param>
                                </xsl:call-template></xsl:if>)</xsl:if>',
                        uniqueId : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="generate-id(.)"/></xsl:call-template>',
                        draggable : true
                    },
                    <xsl:apply-templates select="." mode="sxml:js"/>
                </xsl:with-param>
            </xsl:call-template>
            <xsl:call-template name="point">
                <xsl:with-param name="name" select="name"/>
                <xsl:with-param name="q" select="q"/>
                <xsl:with-param name="descr" select="descr"/>
                <xsl:with-param name="node" select="."/>
                <xsl:with-param name="marker">
                    <xsl:choose>
                        <xsl:when test="@marker"><xsl:apply-templates select="@marker" mode="sxml:quote"/></xsl:when>
                        <xsl:otherwise>point11</xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="comments"><xsl:apply-templates select="thread"/></xsl:with-param>
            </xsl:call-template>
        </div>
    </xsl:template>
    
    <xsl:template match="point" mode="role.list">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role" select="'list'"/>
                <xsl:with-param name="class" select="'project-list-point'"/>
            </xsl:call-template>
            <div class="map-link button">на карте</div>            
            <h3 class="hider"><xsl:value-of select="name"/></h3>
            <div class="hidable hidden">
                <div class="text"><xsl:value-of select="descr"/></div>
                <div class="q"><xsl:value-of select="q"/></div>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="point">
        <xsl:apply-templates select="." mode="role.map"/>
        <xsl:apply-templates select="." mode="role.list"/>
    </xsl:template>

</xsl:stylesheet>    