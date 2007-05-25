<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output
		method="xml"
		encoding="UTF-8"
		indent="yes"
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

	<xsl:param name="Namespace"/>
	<xsl:import href="lib.xsl"/>

	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>Class Tree</title>
				<link rel="stylesheet" type="text/css" href="garaapi.css" />
			</head>
			<body>
				<xsl:call-template name="navigation">
					<xsl:with-param name="namespace" select="$Namespace"/>
				</xsl:call-template>
				<h1>Class Tree</h1>
				Namespace: <xsl:value-of select="$Namespace"/>
				
				<xsl:call-template name="Classes">
					<xsl:with-param name="Super" select="//Namespace[@name = $Namespace]"/>
				</xsl:call-template>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template name="Classes">
		<xsl:param name="Super"/>
		<xsl:if test="count($Super/Class) &gt; 0">
			<ul>
				<xsl:for-each select="$Super/Class">
					<xsl:variable name="className" select="@name"/>
					<li>
						<tt>
							<xsl:choose>
								<xsl:when test="$jsdoc//class[@name = $className and namespace = $Namespace]/@isInterface = 'true'">
									<em>
										<xsl:call-template name="linkClass">
											<xsl:with-param name="className" select="concat($Namespace, '.', @name)"/>
										</xsl:call-template>
									</em>
								</xsl:when>
								<xsl:otherwise>
									<xsl:call-template name="linkClass">
										<xsl:with-param name="className" select="concat($Namespace, '.', @name)"/>
									</xsl:call-template>
								</xsl:otherwise>
							</xsl:choose>
						</tt>
						<xsl:call-template name="Classes">
							<xsl:with-param name="Super" select="."/>
						</xsl:call-template>
					</li>
				</xsl:for-each>
			</ul>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
