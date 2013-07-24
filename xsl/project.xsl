<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns="http://www.w3.org/1999/xhtml" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sxml="http://sergets.ru/sxml"
    xmlns:exsl="http://exslt.org/common">

    <xsl:import href="../sxml/client/sxml.xsl"/>
    <xsl:import href="project-point.xsl"/>
    
    <xsl:output media-type="text/html" method="html"
          omit-xml-declaration="yes"
          doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
          doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
          
    <xsl:template match="/">
        <xsl:call-template name="sxml:page">
            <xsl:with-param name="sxml-root" select="'../sxml'"/>
            <xsl:with-param name="scripts">
                <script relative="true">/js/ugrd.js</script>
                <script>http://api-maps.yandex.ru/2.0-stable/?load=package.standard&amp;lang=ru-RU&amp;onload=_init</script>
                <script relative="true">/js/project.js</script>
            </xsl:with-param>
            <xsl:with-param name="styles">
                <style relative="true">/css/project.xcss</style>
                <style relative="true">/css/sxml-loginlinks.xcss</style>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="/project">
        <xsl:apply-templates select="descr/project"/>
        <xsl:apply-templates select="points"/>
        <div id="project-map"/>
    </xsl:template>
    
    <xsl:template match="descr/project" mode="sxml:class">project-maintitle</xsl:template>
    <xsl:template match="descr/project">
        <div id="project-maintitle">
            <xsl:apply-templates select="." mode="sxml"/>
            <h1><xsl:value-of select="name"/></h1>
        </div>
    </xsl:template>
    
    <xsl:template match="points" mode="sxml:class">points</xsl:template>
    <xsl:template match="points">
        <div>
            <xsl:apply-templates select="." mode="sxml"/>
            <xsl:apply-templates select="point"/>
        </div>
    </xsl:template>
       
</xsl:stylesheet>
