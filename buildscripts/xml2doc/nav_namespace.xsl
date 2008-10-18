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

	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>Namespace</title>
				<link rel="stylesheet" type="text/css" href="garaapi.css" />
			</head>
			<body>
				<base target="main"/>
				<strong><xsl:value-of select="$namespace"/></strong>
				
				<ul id="nav">
					<xsl:for-each select="//Flat/*[@namespace = $namespace]">
						<xsl:sort select="@name"/>
						<li>
							<xsl:choose>
								<xsl:when test="name(.) = 'Interface'">
									<em>
										<a href="{concat($namespace, '.', @name, '.interface.html')}"><xsl:value-of select="@name"/></a>
									</em>
								</xsl:when>
								<xsl:otherwise>
									<a href="{concat($namespace, '.', @name, '.class.html')}"><xsl:value-of select="@name"/></a>
								</xsl:otherwise>
							</xsl:choose>
						</li>
					</xsl:for-each>
				</ul>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>
