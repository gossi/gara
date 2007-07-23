<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output
		method="xml"
		encoding="UTF-8"
		indent="yes"/>

	<xsl:template match="/">
		<ClassTree>
			<xsl:for-each select="//class[not(namespace=preceding-sibling::class/namespace)]/namespace">
				<xsl:variable name="namespace" select="."/>
				<Namespace name="{.}">
					<xsl:for-each select="//class[namespace = $namespace and not(extends) and @isPrivate = 'false']">
						<Class name="{@name}">
							<xsl:call-template name="Subclasses">
								<xsl:with-param name="Super" select="@name"/>
								<xsl:with-param name="Namespace" select="$namespace"/>
							</xsl:call-template>
						</Class>
					</xsl:for-each>
				</Namespace>
			</xsl:for-each>
		</ClassTree>
	</xsl:template>

	<xsl:template name="Subclasses">
		<xsl:param name="Super"/>
		<xsl:param name="Namespace"/>
		
		<xsl:if test="//class[namespace = $Namespace and extends = $Super and @isPrivate = 'false']">
			<xsl:for-each select="//class[namespace = $Namespace and extends = $Super and @isPrivate = 'false']">
				<xsl:sort select="@name"/>
				<Class name="{@name}">
					<xsl:call-template name="Subclasses">
						<xsl:with-param name="Super" select="@name"/>
						<xsl:with-param name="Namespace" select="$Namespace"/>
					</xsl:call-template>
				</Class>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
