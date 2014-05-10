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
          
    <xsl:template name="news-text">
        <xsl:param name="type">announcement</xsl:param>
        <xsl:param name="user"/>
        <xsl:param name="refname"/>
        <xsl:param name="text"/>
        
        <xsl:choose>

            <xsl:when test="$type = 'newpoint'">
                <xsl:call-template name="sxml:user">
                    <xsl:with-param name="user" select="$user"/>
                </xsl:call-template>
                <xsl:text> </xsl:text>
                <xsl:call-template name="sxml:conjugate">
                    <xsl:with-param name="user" select="$user"/>
                    <xsl:with-param name="m">добавил</xsl:with-param>
                    <xsl:with-param name="f">добавила</xsl:with-param>
                </xsl:call-template>
                новую
                <xsl:choose>
                    <xsl:when test="$refname">точку «<a class="news-ref"><xsl:value-of select="$refname"/></a>»</xsl:when>
                    <xsl:otherwise><a class="news-ref">точку</a></xsl:otherwise>
                </xsl:choose>
                с описанием:
                <span class="news-text"><xsl:value-of select="$text"/></span>
            </xsl:when>

            <xsl:when test="$type = 'editpointdescr'">
                <xsl:call-template name="sxml:user">
                    <xsl:with-param name="user" select="$user"/>
                </xsl:call-template>
                <xsl:text> </xsl:text>
                <xsl:call-template name="sxml:conjugate">
                    <xsl:with-param name="user" select="$user"/>
                    <xsl:with-param name="m">изменил</xsl:with-param>
                    <xsl:with-param name="f">изменила</xsl:with-param>
                </xsl:call-template>
                описание у 
                <xsl:choose>
                    <xsl:when test="$refname">точки «<a class="news-ref"><xsl:value-of select="$refname"/></a>»:</xsl:when>
                    <xsl:otherwise><a class="news-ref">точки</a>:</xsl:otherwise>
                </xsl:choose>
                <span class="news-text"><xsl:value-of select="$text"/></span>
            </xsl:when>

            <xsl:when test="$type = 'editpointq'">
                <xsl:call-template name="sxml:user">
                    <xsl:with-param name="user" select="$user"/>
                </xsl:call-template>
                <xsl:text> </xsl:text>
                <xsl:call-template name="sxml:conjugate">
                    <xsl:with-param name="user" select="$user"/>
                    <xsl:with-param name="m">поменял</xsl:with-param>
                    <xsl:with-param name="f">поменяла</xsl:with-param>
                </xsl:call-template>
                вопрос на местности к 
                <xsl:choose>
                    <xsl:when test="$refname">точке «<a class="news-ref"><xsl:value-of select="$refname"/></a>»:</xsl:when>
                    <xsl:otherwise><a class="news-ref">точке</a>:</xsl:otherwise>
                </xsl:choose>
                <span class="news-text"><xsl:value-of select="$text"/></span>
            </xsl:when>
            
            <xsl:when test="$type = 'pointcomment'">
                <xsl:call-template name="sxml:user">
                    <xsl:with-param name="user" select="$user"/>
                </xsl:call-template>
                <xsl:text> </xsl:text>
                <xsl:call-template name="sxml:conjugate">
                    <xsl:with-param name="user" select="$user"/>
                    <xsl:with-param name="m">оставил</xsl:with-param>
                    <xsl:with-param name="f">оставила</xsl:with-param>
                </xsl:call-template>
                комментарий к
                <xsl:choose>
                    <xsl:when test="$refname">точке «<a class="news-ref"><xsl:value-of select="$refname"/></a>»:</xsl:when>
                    <xsl:otherwise><a class="news-ref">точке</a>:</xsl:otherwise>
                </xsl:choose>
                <span class="news-text"><xsl:value-of select="$text"/></span>
            </xsl:when>            
            
            <xsl:when test="$type = 'editpointphotos'">
                <xsl:call-template name="sxml:user">
                    <xsl:with-param name="user" select="$user"/>
                </xsl:call-template>
                <xsl:text> </xsl:text>
                <xsl:choose>
                    <xsl:when test="starts-with(substring-after($text, ';'), substring-before($text, ';'))">
                        <xsl:call-template name="sxml:conjugate">
                            <xsl:with-param name="user" select="$user"/>
                            <xsl:with-param name="m">загрузил</xsl:with-param>
                            <xsl:with-param name="f">загрузила</xsl:with-param>
                        </xsl:call-template>
                        <xsl:variable name="old-photo-count">
                            <xsl:choose>
                                <xsl:when test="substring-before($text, ';') = ''">-1</xsl:when>
                                <xsl:otherwise>
                                    <xsl:call-template name="sxml:count">
                                        <xsl:with-param name="haystack" select="substring-before($text, ';')"/>
                                        <xsl:with-param name="needle" select="' '"/>
                                    </xsl:call-template>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:variable>
                        <xsl:variable name="new-photo-count">
                            <xsl:call-template name="sxml:count">
                                <xsl:with-param name="haystack" select="substring-after($text, ';')"/>
                                <xsl:with-param name="needle" select="' '"/>
                            </xsl:call-template>
                        </xsl:variable>
                        <xsl:variable name="photo-diff">
                            <xsl:choose>
                                <xsl:when test="substring-before($text, ';') = ''">
                                    <xsl:value-of select="substring-after($text, ';')"/>
                                </xsl:when>
                                <xsl:otherwise>
                                    <xsl:value-of select="substring-after(substring-after($text, ';'), concat(substring-before($text, ';'), ' '))"/>
                                </xsl:otherwise>
                            </xsl:choose>
                        </xsl:variable>
                        <xsl:text> </xsl:text>
                        <xsl:call-template name="sxml:incline">
                            <xsl:with-param name="number" select="$new-photo-count - $old-photo-count"/>
                            <xsl:with-param name="one">фотографию</xsl:with-param>
                            <xsl:with-param name="few">фотографии</xsl:with-param>
                            <xsl:with-param name="many">фотографий</xsl:with-param>
                        </xsl:call-template>
                        к точке «<a class="news-ref"><xsl:value-of select="$refname"/></a>»:
                        <div class="news-photos-fileinput">
                            <xsl:attribute name="ondblclick">return {
                                photos : '<xsl:call-template name="sxml:quote"><xsl:with-param name="v" select="$photo-diff"/></xsl:call-template>'
                            }</xsl:attribute>
                        </div>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:call-template name="sxml:conjugate">
                            <xsl:with-param name="user" select="$user"/>
                            <xsl:with-param name="m">изменил</xsl:with-param>
                            <xsl:with-param name="f">изменила</xsl:with-param>
                        </xsl:call-template>
                        фотографии
                        <xsl:choose>
                            <xsl:when test="$refname">точки «<a class="news-ref"><xsl:value-of select="$refname"/></a>».</xsl:when>
                            <xsl:otherwise><a class="news-ref">точки</a>.</xsl:otherwise>
                        </xsl:choose>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:when>

            <xsl:otherwise>
                <xsl:call-template name="sxml:user">
                    <xsl:with-param name="user" select="$user"/>
                </xsl:call-template>:
                <xsl:value-of select="$text"/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>

    <!-- Matching templates -->

    <xsl:template match="news" mode="sxml:js">news : {
        id : '<xsl:apply-templates select="@sxml:item-id" mode="sxml:quote"/>',
        type : '<xsl:apply-templates select="@type" mode="sxml:quote"/>',
        reftype : <xsl:choose>
            <xsl:when test="
                (@type = 'newpoint')
                    or (@type = 'editpointq')
                    or (@type = 'editpointdescr')
                    or (@type = 'editpointphotos')
                    or (@type = 'pointcomment')
                        ">'point'</xsl:when>
            <xsl:otherwise>null</xsl:otherwise>
        </xsl:choose>,
        ref : '<xsl:apply-templates select="@ref" mode="sxml:quote"/>',
        date : '<xsl:apply-templates select="@sxml:time" mode="sxml:quote"/>'
    }</xsl:template>

    <xsl:template match="news" mode="sxml:class">news news-<xsl:value-of select="@type"/></xsl:template>

    <xsl:template match="news">
        <div>
            <xsl:apply-templates mode="sxml" select="."/>
            <span class="news-date">
                <xsl:apply-templates mode="sxml:date" select="."/>
            </span>
            <xsl:call-template name="news-text">
                <xsl:with-param name="type" select="@type"/>
                <xsl:with-param name="user" select="@sxml:user"/>
                <xsl:with-param name="refname" select="@refname"/>
                <xsl:with-param name="text" select="text"/>
            </xsl:call-template>
        </div>
    </xsl:template>

</xsl:stylesheet>    