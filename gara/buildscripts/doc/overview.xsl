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
				<title>Overview</title>
				<link rel="stylesheet" type="text/css" href="garaapi.css" />
			</head>
			<body>
				<xsl:call-template name="navigation">
					<xsl:with-param name="namespace" select="$Namespace"/>
				</xsl:call-template>
				<h1><xsl:value-of select="$Namespace"/></h1>
				<h2>Summary</h2>
				
				<table>
					<tbody>
						<xsl:for-each select="//class[namespace = $Namespace]">
							<xsl:sort select="@name"/>
							<tr>
								<td class="returnType">
									<xsl:choose>
										<xsl:when test="@isInterface = 'true'">
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
								</td>
								<td>
									<xsl:value-of select="summary"/>
								</td>
							</tr>
						</xsl:for-each>
					</tbody>
				</table>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>
