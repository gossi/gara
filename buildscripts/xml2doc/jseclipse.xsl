<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:exsl="http://exslt.org/common"
	extension-element-prefixes="exsl">

	<xsl:output
		method="xml"
		encoding="UTF-8"
		indent="yes"
		cdata-section-elements="item"/>
	
	<xsl:param name="showPrivate"/>
	<xsl:param name="hierarchyPath"/>
	<xsl:variable name="hierarchy" select="exsl:node-set(document($hierarchyPath))"/>
	<xsl:variable name="substr" select="concat(//class/@name, '.')"/>

	<xsl:template match="/">
		<xsl:variable name="super">
			<xsl:call-template name="getParent">
				<xsl:with-param name="canonicalName" select="concat(//class/namespace, '.', //class/@name)"/>
			</xsl:call-template>
		</xsl:variable>

		<completion prefix="{concat(//class/namespace, '.', //class/@name)}" extends="{$super}">

			<xsl:variable name="xpathexprFields"
				select="//class/fields/field[@isPrivate=$showPrivate] | //class/fields/field[@isPrivate='false']"/>

			<xsl:for-each select="$xpathexprFields">
				<xsl:sort select="@name"/>
				<xsl:variable name="fieldName" select="substring-after(@name, $substr)"/>
				<item repl="{$fieldName}" display="{$fieldName}">
					<xsl:value-of select="description"/>
				</item>
			</xsl:for-each>
			
			<xsl:variable name="xpathexprMethods"
				select="//class/methods/method[@isPrivate=$showPrivate] | //class/methods/method[@isPrivate='false']"/>
			
			<xsl:for-each select="$xpathexprMethods">
				<xsl:sort select="@name"/>

				<xsl:variable name="methodName" select="substring-after(@name, $substr)"/>
				<xsl:variable name="returnType">
					<xsl:choose>
						<xsl:when test="return">
							<xsl:value-of select="return/@type"/>
						</xsl:when>
						<xsl:when test="type">
							<xsl:value-of select="type"/>
						</xsl:when>
						<xsl:otherwise>void</xsl:otherwise>
					</xsl:choose>
				</xsl:variable>
				
				<item repl="{$methodName}()" display="{$methodName}() {returnType}">
					<xsl:value-of select="description"/>
					<xsl:text>&#10;&#10;</xsl:text>

					<xsl:if test="count(params/param) &gt; 0">
						Parameters:
						<xsl:for-each select="params/param">
							<xsl:text>   </xsl:text>(<xsl:value-of select="@type"/>) <xsl:value-of select="@name"/> - <xsl:value-of select="description"/><xsl:text>&#10;</xsl:text>
						</xsl:for-each>
						<xsl:text>&#10;</xsl:text>
					</xsl:if>
				
					<xsl:if test="count(throws/throw) &gt; 0">
						Throws:
						<xsl:for-each select="throws/throw">
							<xsl:text>   </xsl:text><xsl:value-of select="@type"/><xsl:text> - </xsl:text><xsl:value-of select="description"/><xsl:text>&#10;</xsl:text>
						</xsl:for-each>
						<xsl:text>&#10;</xsl:text>
					</xsl:if>
	
					<xsl:if test="return != ''">
						Returns:
						<xsl:text>   </xsl:text><xsl:value-of select="return"/>
						<xsl:text>&#10;</xsl:text>
					</xsl:if>
					<xsl:if test="since != ''">
						Since:
						<xsl:text>   </xsl:text><xsl:value-of select="since"/>
					</xsl:if>
				</item>
			</xsl:for-each>
		</completion>
	</xsl:template>
	
	<xsl:template name="getParent">
		<xsl:param name="canonicalName"/>
	
		<xsl:variable name="namespace">
			<xsl:call-template name="getNamespace">
				<xsl:with-param name="Object" select="$canonicalName"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="className">
			<xsl:call-template name="getClass">
				<xsl:with-param name="Object" select="$canonicalName"/>
			</xsl:call-template>
		</xsl:variable>

		<xsl:value-of select="$hierarchy//Flat/Class[@name = $className and @namespace = $namespace]/@extends"/>
	</xsl:template>
	
	<xsl:template name="getNamespace">
		<xsl:param name="Object" />
		
		<xsl:if test="contains($Object, '.')">
			<xsl:variable name="namespace">
				<xsl:value-of select="substring-before($Object, '.')"/>
				<xsl:if test="contains(substring-after($Object, '.'), '.')">
					<xsl:text>.</xsl:text>
					<xsl:call-template name="getNamespace">
						<xsl:with-param name="Object" select="substring-after($Object, '.')"/>
					</xsl:call-template>
				</xsl:if>
			</xsl:variable>
			<xsl:value-of select="$namespace"/>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="getClass">
		<xsl:param name="Object"/>
		
		<xsl:variable name="namespace">
			<xsl:call-template name="getNamespace">
				<xsl:with-param name="Object" select="$Object"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:value-of select="substring-after($Object, concat($namespace, '.'))"/>
	</xsl:template>
</xsl:stylesheet>
