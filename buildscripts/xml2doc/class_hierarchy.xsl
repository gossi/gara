<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output
		method="xml"
		encoding="UTF-8"
		indent="yes"/>

	<xsl:template match="/">
		<Hierarchy>
			<Tree>
				<xsl:for-each select="//class[not(extends) and @isPrivate = 'false']">
					<Class name="{@name}" namespace="{namespace}">
						<xsl:call-template name="Subclasses">
							<xsl:with-param name="Super" select="@name"/>
							<xsl:with-param name="Namespace" select="namespace"/>
						</xsl:call-template>
					</Class>
				</xsl:for-each>
				<xsl:for-each select="//interface[not(extends) and @isPrivate = 'false']">
					<Interface name="{@name}" namespace="{namespace}">
						<xsl:call-template name="Subinterfaces">
							<xsl:with-param name="Super" select="@name"/>
							<xsl:with-param name="Namespace" select="namespace"/>
						</xsl:call-template>
					</Interface>
				</xsl:for-each>
			</Tree>
			<Flat>
				<xsl:for-each select="//class[@isPrivate = 'false']">
					<Class name="{@name}" namespace="{namespace}" extends="{extends}"/>
				</xsl:for-each>
				<xsl:for-each select="//interface[@isPrivate = 'false']">
					<Interface name="{@name}" namespace="{namespace}" extends="{extends}"/>
				</xsl:for-each>
			</Flat>
		</Hierarchy>
	</xsl:template>

	<xsl:template name="Subclasses">
		<xsl:param name="Super"/>
		<xsl:param name="Namespace"/>

		<xsl:for-each select="//class[extends = concat($Namespace, '.', $Super) and @isPrivate = 'false']">
			<xsl:sort select="@name"/>
			<Class name="{@name}" namespace="{namespace}">
				<xsl:call-template name="Subclasses">
					<xsl:with-param name="Super" select="@name"/>
					<xsl:with-param name="Namespace" select="namespace"/>
				</xsl:call-template>
			</Class>
		</xsl:for-each>
	</xsl:template>

	<xsl:template name="Subinterfaces">
		<xsl:param name="Super"/>
		<xsl:param name="Namespace"/>

		<xsl:for-each select="//interface[extends = concat($Namespace, '.', $Super) and @isPrivate = 'false']">
			<xsl:sort select="@name"/>
			<Interface name="{@name}" namespace="{namespace}">
				<xsl:call-template name="Subinterfaces">
					<xsl:with-param name="Super" select="@name"/>
					<xsl:with-param name="Namespace" select="namespace"/>
				</xsl:call-template>
			</Interface>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
