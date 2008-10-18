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

	<xsl:param name="namespace"/>
	<xsl:import href="lib.xsl"/>

	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>Namespace</title>
				<link rel="stylesheet" type="text/css" href="garaapi.css" />
			</head>
			<body>
				<xsl:call-template name="navigation">
					<xsl:with-param name="namespace" select="$namespace"/>
				</xsl:call-template>
				<h1><xsl:value-of select="$namespace"/></h1>

				<h2>Classes</h2>
				<table>
					<tbody>
						<xsl:for-each select="//class[namespace = $namespace]">
							<xsl:sort select="@name"/>
							<tr>
								<td class="returnType">
									<a href="{concat($namespace, '.', @name, '.class.html')}"><xsl:value-of select="@name"/></a>
								</td>
								<td>
									<xsl:value-of select="summary"/>
								</td>
							</tr>
						</xsl:for-each>
					</tbody>
				</table>

				<h2>Interfaces</h2>
				<table>
					<tbody>
						<xsl:for-each select="//interface[namespace = $namespace]">
							<xsl:sort select="@name"/>
							<tr>
								<td class="returnType">
									<a href="{concat($namespace, '.', @name, '.interface.html')}"><xsl:value-of select="@name"/></a>
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
