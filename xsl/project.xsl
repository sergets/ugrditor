<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns="http://www.w3.org/1999/xhtml" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sxml="http://sergets.ru/sxml"
    xmlns:exsl="http://exslt.org/common">

    <xsl:output media-type="text/html" method="html"
          omit-xml-declaration="yes"
          doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
          doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
          
    <xsl:include href="../sxml/client/xsl/sxml.xsl"/>
    <xsl:include href="project/point.xsl"/>
    <xsl:include href="project/news.xsl"/>
    
    <xsl:template match="/">
        <xsl:call-template name="sxml:page">
            <xsl:with-param name="sxml-root" select="'../sxml'"/>
            <xsl:with-param name="scripts">
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
        <!-- title -->
        <xsl:apply-templates select="descr/project"/>
        
        <div id="project-hiddens">
            <xsl:apply-templates select="points" mode="role.map"/>
        </div>

        <!-- rollout panes -->
        <xsl:apply-templates select="points" mode="role.list"/> 

        <!-- map pane -->
        <div id="project-map"/>
    </xsl:template>
    
    <xsl:template match="descr/project" mode="sxml:class">project-maintitle</xsl:template>
    <xsl:template match="descr/project" mode="sxml:js">project : { orgs : '<xsl:apply-templates mode="sxml:quote" select="@sxml:open-to"/>' }</xsl:template>
    <xsl:template match="descr/project">
        <div id="project-maintitle">
            <xsl:apply-templates select="." mode="sxml"/>
            <h1><xsl:value-of select="name"/></h1>
            <div class="project-orgs">Организаторы: <div class="userinput"></div></div>
            <div class="rollouts-header rollouts-header-left">
                <div class="rollout-header rollout-header-selected">Точки <!--span class="rollout-header-number">3</span--></div>
                <!--div class="rollout-header">Задачи <span class="rollout-header-number">0</span></div>
                <div class="rollout-header">Трасса <span class="rollout-header-number">0</span></div-->
            </div>
        </div>
    </xsl:template>

    <xsl:template match="points" mode="role.map">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role">map</xsl:with-param>
                <xsl:with-param name="class">project-mappoints</xsl:with-param>
                <xsl:with-param name="extras">detachableChildren : true</xsl:with-param>
            </xsl:call-template>
            <xsl:apply-templates select="point" mode="role.map"/>
        </div>
    </xsl:template>
    
    <xsl:template match="points" mode="role.list">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role">list</xsl:with-param>
                <xsl:with-param name="class">project-pointlist project-rollout</xsl:with-param>
                <xsl:with-param name="js">rollout : { id : 'points', role : 'rollout' }</xsl:with-param>
                </xsl:call-template>
            <xsl:apply-templates select="point" mode="role.list"/>
        </div>
    </xsl:template>
    
    <xsl:template match="points" mode="role.header">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role">header</xsl:with-param>
                <xsl:with-param name="class">rollout-header</xsl:with-param>
                <xsl:with-param name="js">rollout : { id : 'points', role : 'header' }</xsl:with-param>
            </xsl:call-template>
            Точки <span class="rollout-header-number"><xsl:value-of select="count(point)"/></span>
        </div>
    </xsl:template>    
    
    <xsl:template match="points">
        <xsl:apply-templates select="." mode="role.map"/>
        <xsl:apply-templates select="." mode="role.list"/>
        <xsl:apply-templates select="." mode="role.header"/>
    </xsl:template>
    
    <!-- НОВОСТИ -->
    <xsl:template match="newslist" mode="role.list">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role">list</xsl:with-param>
                <xsl:with-param name="class">project-newslist project-rollout</xsl:with-param>
                <xsl:with-param name="js">rollout : { id : 'news', role : 'rollout' }</xsl:with-param>
                </xsl:call-template>
            <xsl:apply-templates select="news"/>
        </div>
    </xsl:template>
    
    <xsl:template match="newslist" mode="role.header">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role">header</xsl:with-param>
                <xsl:with-param name="class">rollout-header</xsl:with-param>
                <xsl:with-param name="js">rollout : { id : 'news', role : 'header' }</xsl:with-param>
            </xsl:call-template>
            Новости <span class="rollout-header-number"><xsl:value-of select="count(news)"/></span>
        </div>
    </xsl:template>
    
    <xsl:template match="newslist">
        <xsl:apply-templates select="." mode="role.list"/>
        <xsl:apply-templates select="." mode="role.header"/>
    </xsl:template>    
       
</xsl:stylesheet>
