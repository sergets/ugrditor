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

    <xsl:template name="rich-map-object-form">
        <xsl:param name="name"/>
        <xsl:param name="content"/>
        <xsl:param name="marker"/>
        <xsl:param name="title-placeholder"/>
        <xsl:param name="comments"/>
        <xsl:param name="node-for-data"/>
        <xsl:param name="photos"/>

            <form class="editor">
                <div class="small-toolbar">
                    <a class="button edit-button" href="#"></a>
                </div>
                <h3>
                    <img class="view-only marker view-marker" src="img/{$marker}-xs.png"/>
                    <img class="edit-only marker edit-marker" src="img/{$marker}-xs.png"/>
                    <div class="marker-dropdown hidden"></div>
                    <span class="view-only"><xsl:value-of select="$name"/></span>
                    <input class="edit-only title-input inplace" value="{$name}" placeholder="{$title-placeholder}"/>
                </h3>
                <div class="photos view-photos view-only"/>
                <div class="photos edit-photos edit-only"/>

                <xsl:copy-of select="exsl:node-set($content)"/>

                <div class="save-toolbar edit-only">
                    <input type="button" class="button delete-button button-with-tooltip" title="Удалить точку"/>
                    <input type="submit" class="button save-button" value="Сохранить"/>
                </div>
            </form>
            
            <div class="data-pane">
                <span class="editor-author edit-blur">
                    <xsl:apply-templates mode="sxml:user" select="$node-for-data"/>
                </span>
                
                <span class="editor-date">
                    <xsl:apply-templates select="$node-for-data" mode="sxml:date"/>
                </span>
            </div>
            <xsl:copy-of select="exsl:node-set($comments)"/>
    </xsl:template>
    
    
    <xsl:template name="inplace-textarea">
        <xsl:param name="val"/>
        <xsl:param name="class"/>
        <xsl:param name="placeholder"/>

        <div>
            <xsl:attribute name="class"><xsl:value-of select="$class"/> view-only</xsl:attribute>
            <xsl:call-template name="sxml:replace">
                <xsl:with-param name="haystack" select="$val"/>
                <xsl:with-param name="needle" select="'&#10;'"/>
                <xsl:with-param name="replace"><br/></xsl:with-param>
            </xsl:call-template>
        </div>
        <textarea placeholder="{$placeholder}">
            <xsl:attribute name="class"><xsl:value-of select="$class"/> edit-only inplace</xsl:attribute>
            <xsl:value-of select="$val"/>
        </textarea>
    </xsl:template>

</xsl:stylesheet>    