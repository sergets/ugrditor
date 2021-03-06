<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:sxml="http://sergets.ru/sxml"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt"    
    xmlns:exsl="http://exslt.org/common"
    >

    <xsl:output media-type="text/html" method="html"
          omit-xml-declaration="yes"
          doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
          doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
    
    <xsl:include href="../sxml/client/xsl/sxml.xsl"/>
          
    <xsl:template match="/">
        <xsl:call-template name="sxml:page">
            <xsl:with-param name="sxml-root" select="'../sxml'"/>
            <xsl:with-param name="scripts">
                <script relative="true">/js/projects.js</script>
            </xsl:with-param>
            <xsl:with-param name="styles">
                <style relative="true">/css/projects.xcss</style>
                <style relative="true">/css/sxml-loginlinks.xcss</style>
            </xsl:with-param>
        </xsl:call-template>
    </xsl:template>
    
    <xsl:template match="page">
        <h1 class="pagetitle">Угородайская планерная</h1>
        <div class="section pagebody">
            <h3>Привет!</h3>
            <div class="panel sectioncontent">
                Вот список подготавливаемых угородаек — конечно, только тех, которые вам можно смотреть ;).
                Выберите одну из них — откроется карта, на которой можно ставить точки и общаться.
            </div>
        </div>
        <xsl:apply-templates select="projects"/>
    </xsl:template>

    <xsl:template match="projects">
        <div>
            <xsl:apply-templates select="." mode="sxml"/>
            <div class="section pagebody">
                <h3>Проекты</h3>
                <xsl:for-each select="project">
                    <xsl:sort select="position()" data-type="number" order="descending"/>
                    <xsl:apply-templates select="."/>
                </xsl:for-each>
                <!--xsl:apply-templates select="project"/-->
            </div>
            <xsl:call-template name="sxml:if-permitted">
            <xsl:with-param name="rules" select="'#'"/>
            <xsl:with-param name="then">
                <div class="section pagebody">
                    <h3 class="hider">Добавить новый проект</h3>
                    <form class="newprojectform hidable hidden">
                        <div class="panel sectioncontent">
                            <dl class="sectioncontent">
                                <dt>Название:</dt><dd><input class="panel field" name="name"/></dd>
                                <dt>Организаторы:</dt><dd><div class="panel field rightsinput"/></dd>
                                <dt>Обложка:</dt><dd><div class="fileinput"/></dd>
                                <dt>Описание:</dt><dd><textarea class="panel field" name="descr"></textarea></dd>
                            </dl>
                        </div>
                        <input type="submit" class="panel button" value="Создать проект"/>
                    </form>
                </div>
            </xsl:with-param>
        </xsl:call-template>
        </div>
    </xsl:template>
    <xsl:template match="projects" mode="sxml:extras">loginDependent: true</xsl:template>
    
    <xsl:template match="project">
        <div>
            <xsl:apply-templates select="." mode="sxml"/>
            <xsl:if test="cover">
                <xsl:attribute name="style">
                    background-image: url('uploads/<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="cover"/></xsl:call-template>?s=310x240');
                </xsl:attribute>
            </xsl:if>    
            <div class="projdescr">
                <div class="text">
                    <h4><a href="project.xml?id={@sxml:item-id}"><xsl:value-of select="name"/></a></h4>
                    <xsl:value-of select="descr"/>
                </div>
                <xsl:if test="not(@sxml:open-to-me) and (points = '0')">
                    <div class="button delete"/>
                </xsl:if>
                <div class="orgs">
                    <div class="userinput"/>
                </div>
            </div>
            
        </div>
    </xsl:template>
    <xsl:template match="project" mode="sxml:class">sectioncontent panel project</xsl:template>
    <xsl:template match="project" mode="sxml:js">project : { id : '<xsl:apply-templates mode="sxml:quote" select="@sxml:item-id"/>', orgs : '<xsl:apply-templates mode="sxml:quote" select="@sxml:open-to"/>' }</xsl:template>
    <xsl:template match="project" mode="sxml:extras">loginDependent: true</xsl:template>

</xsl:stylesheet>