<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns="http://www.w3.org/1999/xhtml" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sxml="http://sergets.ru/sxml"
    xmlns:exsl="http://exslt.org/common">

    <xsl:import href="../sxml/client/sxml.xsl"/>
    <xsl:output media-type="text/html" method="html"
          omit-xml-declaration="yes"
          doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
          doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
          
    <xsl:template match="msg" mode="point-comments">
        <div>
            <xsl:apply-templates select="." mode="sxml"/>
            <span class="point-comment-username">
                <xsl:apply-templates select="." mode="sxml:user"/>:
            </span>
            <xsl:value-of select="text"/>
            <span class="point-comment-date">
                <xsl:apply-templates select="." mode="sxml:date"/>
            </span>
        </div>
    </xsl:template>
    
    <xsl:template match="msg" mode="sxml:class">point-comment</xsl:template>
    <xsl:template match="msg" mode="sxml:js">msg : {
        id : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="@sxml:item-id"/></xsl:call-template>',
        thread : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="../../id"/></xsl:call-template>'
    }</xsl:template>
    
    <xsl:template match="point" mode="point-comments">
        <div class="point-comments-header point-edit-blur">
            <xsl:choose> 
                <xsl:when test="count(thread/messages/msg) &gt; 0">
                    <xsl:call-template name="sxml:incline">
                        <xsl:with-param name="number" select="count(thread/messages/msg)"/>
                        <xsl:with-param name="one">комментарий</xsl:with-param>
                        <xsl:with-param name="few">комментария</xsl:with-param>
                        <xsl:with-param name="many">комментариев</xsl:with-param>
                    </xsl:call-template>
                </xsl:when>
                <xsl:otherwise>
                    Написать первый комментарий
                </xsl:otherwise>
            </xsl:choose>
        </div>
        <div>
            <xsl:apply-templates mode="sxml" select="thread"/>
        
            <div class="point-comments-close"></div>
            <div class="point-comments-wrapper">
            
                <xsl:apply-templates select="thread/messages/msg" mode="point-comments"/>
                
                <xsl:call-template name="sxml:if-permitted">
                    <xsl:with-param name="rules" select="thread/open-to"/>
                    <xsl:with-param name="then">
                    
                        <form class="point-comments-editor">
                            <span class="point-comment-username">
                                <xsl:call-template name="sxml:user">
                                    <xsl:with-param name="user" select="/*/sxml:data/sxml:user"/>
                                </xsl:call-template>:
                            </span>
                            <textarea class="point-comment-input inplace"></textarea>
                            <div type="submit" class="point-comment-toolbar">
                                <input type="submit" class="button point-comment-post-button" value="Отправить"/>
                            </div>
                        </form>
                        
                    </xsl:with-param>
                    <xsl:with-param name="else">
                    
                        Нельзя :(
                    
                    </xsl:with-param>
                </xsl:call-template>
           
            </div>
        </div>
    </xsl:template>
    
    <xsl:template match="thread" mode="sxml:class">point-comments point-edit-blur</xsl:template>
    <xsl:template match="thread" mode="sxml:js">thread : { id : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="id"/></xsl:call-template>' }</xsl:template>
    <xsl:template match="thread" mode="sxml:extras">loginDependent: true, update : [ 'messages' ]</xsl:template>
    
</xsl:stylesheet>