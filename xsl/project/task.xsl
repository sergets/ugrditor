<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns="http://www.w3.org/1999/xhtml" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sxml="http://sergets.ru/sxml"
    xmlns:exsl="http://exslt.org/common">

    <!-- TODO xsl:include href="t-comments.xsl"/-->
    <xsl:output media-type="text/html" method="html"
          omit-xml-declaration="yes"
          doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
          doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
    
    <xsl:template name="task">
        <xsl:param name="name"/>
        <xsl:param name="text"/>
        <xsl:param name="solution"/>
        <xsl:param name="marker"/>
        <xsl:param name="photos"/>
        <xsl:param name="node"/>
        <xsl:param name="thread"/>
        <xsl:param name="extthread"/>
        <xsl:param name="node"/>

        <xsl:variable name="comments">
            <div class="comments">[cmnts]</div>
        </xsl:variable>
        
        <xsl:call-template name="rich-map-object-form">
            <xsl:with-param name="name" select="$name"/>
            <xsl:with-param name="marker" select="$marker"/>
            <xsl:with-param name="title-placeholder" select="'Краткое название (можно не палиться)'"/>
            <xsl:with-param name="comments" select="$comments"/>
            <xsl:with-param name="photos" select="$photos"/>
            <xsl:with-param name="node-for-data" select="$node"/>
            <xsl:with-param name="content">
                <div class="concerning-edit edit-only"></div>
                <div class="concerning-view view-only"></div>
                <xsl:call-template name="inplace-textarea">
                    <xsl:with-param name="class" select="'text'"/>
                    <xsl:with-param name="val" select="$text"/>
                    <xsl:with-param name="placeholder" select="'Текст загадки'"/>
                </xsl:call-template>
                <xsl:call-template name="inplace-textarea">
                    <xsl:with-param name="class" select="'solution'"/>
                    <xsl:with-param name="val" select="$solution"/>
                    <xsl:with-param name="placeholder" select="'Комментарий с разгадкой'"/>
                </xsl:call-template>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>
    
    <!-- Matching templates -->
    
    <xsl:template match="task" mode="sxml:js">task : {
        id : '<xsl:apply-templates select="@sxml:item-id" mode="sxml:quote"/>',
        empty : '<xsl:apply-templates select="@empty" mode="sxml:quote"/>',
        mapId : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="generate-id(.)"/></xsl:call-template>',
        photos : '<xsl:apply-templates select="photos" mode="sxml:quote"/>',
        marker : '<xsl:choose>
            <xsl:when test="@marker"><xsl:apply-templates select="@marker" mode="sxml:quote"/></xsl:when>
            <xsl:otherwise>task11</xsl:otherwise>
        </xsl:choose>',
        concerning : '<xsl:apply-templates select="@concerning" mode="sxml:quote"/>'
    }</xsl:template>
    
    <xsl:template match="task" mode="role.map">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role" select="'map'"/>
                <xsl:with-param name="class" select="'task'"/>
                <xsl:with-param name="js">
                    map: {
                        lat : '<xsl:apply-templates select="@lat" mode="sxml:quote"/>',
                        lon : '<xsl:apply-templates select="@lon" mode="sxml:quote"/>',
                        icon : '<xsl:choose>
                            <xsl:when test="@marker"><xsl:apply-templates select="@marker" mode="sxml:quote"/></xsl:when>
                            <xsl:otherwise>task11</xsl:otherwise>
                        </xsl:choose>',
                        hint : '<xsl:apply-templates select="name" mode="sxml:quote"/><xsl:if
                            test="thread/messages/msg or extthread/messages/msg"> (<xsl:call-template name="sxml:incline">
                                    <xsl:with-param name="number" select="extthread/messages/@sxml:total + thread/messages/@sxml:total"/>
                                    <xsl:with-param name="one">ответ</xsl:with-param>
                                    <xsl:with-param name="few">ответа</xsl:with-param>
                                    <xsl:with-param name="many">ответов</xsl:with-param>
                                </xsl:call-template>)</xsl:if>',
                        uniqueId : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="generate-id(.)"/></xsl:call-template>',
                        draggable : true
                    },
                    <xsl:apply-templates select="." mode="sxml:js"/>
                </xsl:with-param>
            </xsl:call-template>

            <xsl:call-template name="task">
                <xsl:with-param name="name" select="name"/>
                <xsl:with-param name="text" select="text"/>
                <xsl:with-param name="solution" select="solution"/>
                <xsl:with-param name="node" select="."/>
                <xsl:with-param name="marker">
                    <xsl:choose>
                        <xsl:when test="@marker"><xsl:apply-templates select="@marker" mode="sxml:quote"/></xsl:when>
                        <xsl:otherwise>task11</xsl:otherwise>
                    </xsl:choose>
                </xsl:with-param>
                <xsl:with-param name="thread" select="thread"/>
                <xsl:with-param name="extthread" select="extthread"/>
            </xsl:call-template>
        </div>
    </xsl:template>
    
    <xsl:template match="task" mode="role.list">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role" select="'list'"/>
                <xsl:with-param name="class" select="'project-list-task'"/>
            </xsl:call-template>
            <div class="map-link button">на карте</div>            
            <h3 class="hider"><xsl:value-of select="name"/></h3>
            <div class="hidable hidden">
                <div class="text"><xsl:value-of select="descr"/></div>
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="task">
        <xsl:apply-templates select="." mode="role.map"/>
        <xsl:apply-templates select="." mode="role.list"/>
        <xsl:apply-templates select="." mode="role.testing"/>
    </xsl:template>

</xsl:stylesheet>    