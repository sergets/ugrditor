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
          
    <xsl:template match="msg" mode="thread">
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
    
    <xsl:template match="thread">
        <div>
            <xsl:apply-templates mode="sxml" select="."/>
        
            <div class="point-comments-header point-edit-blur">
                <xsl:choose>
                    <xsl:when test="messages/@sxml:total &gt; 0">
                        <xsl:call-template name="sxml:incline">
                            <xsl:with-param name="number" select="messages/@sxml:total"/>
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
            <div class="point-comments point-edit-blur">
                <div class="point-comments-close"></div>
                <div class="point-comments-wrapper">
                
                    <xsl:apply-templates select="messages/msg" mode="thread"/>
                    
                    <xsl:call-template name="sxml:if-permitted">
                        <xsl:with-param name="rules" select="open-to"/>
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
        </div>
    </xsl:template>
    
    <xsl:template match="thread" mode="sxml:class">point-comments-thread point-edit-blur</xsl:template>
    <xsl:template match="thread" mode="sxml:js">thread : { id : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="id"/></xsl:call-template>' }</xsl:template>
    <xsl:template match="thread" mode="sxml:extras">loginDependent: true, update : [ 'thread' ]</xsl:template>
    
</xsl:stylesheet>