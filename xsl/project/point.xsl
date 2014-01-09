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
        <xsl:param name="comments"/>
        <!-- TODO: param name="permit-..." -->
            <form class="point-editor">
                <div class="small-toolbar">
                    <a class="button point-edit-button" href="#"></a>
                </div>
                <h3>
                    <span class="point-view-only"><xsl:value-of select="$name"/></span>
                    <input class="point-edit-only point-title-input inplace" value="{$name}" placeholder="Краткое название точки"/>
                </h3>
                <!--div class="photos point-edit-blur">
                    <img src="http://cs425624.vk.me/v425624831/1ff/lxW1fNbt9O0.jpg" class="photo"/>
                    <img src="http://cs319121.vk.me/v319121831/75c2/M2XcOQhlFdk.jpg" class="photo"/>
                    <img src="http://cs425624.vk.me/v425624831/217/riX0zunRVXA.jpg" class="photo"/>
                    <div class="photo plus">
                        добавить фото
                    </div>
                </div-->
                <div class="text point-view-only">
                    <xsl:call-template name="sxml:replace">
                        <xsl:with-param name="haystack" select="$descr"/>
                        <xsl:with-param name="needle" select="'&#10;'"/>
                        <xsl:with-param name="replace"><br/></xsl:with-param>
                    </xsl:call-template>
                </div>
                <textarea class="text point-edit-only inplace" placeholder="Описание точки, комментарий"><xsl:value-of select="$descr"/></textarea>
                <div class="question point-view-only">
                    <xsl:call-template name="sxml:replace">
                        <xsl:with-param name="haystack" select="$q"/>
                        <xsl:with-param name="needle" select="'&#10;'"/>
                        <xsl:with-param name="replace"><br/></xsl:with-param>
                    </xsl:call-template>
                </div>
                <textarea class="question point-edit-only inplace" placeholder="Варианты вопроса на местности"><xsl:value-of select="$q"/></textarea>

                <div class="point-save-toolbar point-edit-only">
                    <input type="button" class="button point-delete-button button-with-tooltip" title="Удалить точку"/>
                    <input type="submit" class="button point-save-button" value="Сохранить"/>
                </div>
            </form>
            
            <div class="point-data-pane">
                <span class="point-author point-edit-blur">
                    <xsl:apply-templates mode="sxml:user" select="."/>
                </span>
                
                <span class="point-date">
                    <xsl:apply-templates select="." mode="sxml:date"/>
                </span>
            </div>
            <!--div class="permissions point-edit-blur">ограничить доступ пока нельзя</div-->
            <xsl:copy-of select="exsl:node-set($comments)"/>
            <!--div class="point-comments-header point-edit-blur">
                <xsl:choose> 
                    <xsl:when test="count(exsl:node-set($comments)/*) &gt; 0">
                        <xsl:call-template name="sxml:incline">
                            <xsl:with-param name="number" select="count(exsl:node-set($comments)/*)"/>
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
                
                    <xsl:copy-of select="exsl:node-set($comments)"/>
                    <xsl:choose >
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
               
                </div>
            </div-->
        
    </xsl:template>
    
    <!-- Matching templates -->
    
    <xsl:template match="point" mode="sxml:js">point : {
        id : '<xsl:apply-templates select="@sxml:item-id" mode="sxml:quote"/>',
        empty : '<xsl:apply-templates select="@empty" mode="sxml:quote"/>',
        mapId : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="generate-id(.)"/></xsl:call-template>',
    }</xsl:template>
    
    <xsl:template match="point" mode="role.map">
        <div>
            <xsl:call-template name="sxml:attrs">
                <xsl:with-param name="node" select="exsl:node-set(.)"/>
                <xsl:with-param name="role" select="'map'"/>
                <xsl:with-param name="class" select="'point'"/>
                <xsl:with-param name="js">
                    map: {
                        lat : '<xsl:apply-templates select="@lat" mode="sxml:quote"/>',
                        lon : '<xsl:apply-templates select="@lon" mode="sxml:quote"/>',
                        hint : '<xsl:apply-templates select="name" mode="sxml:quote"/>',
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