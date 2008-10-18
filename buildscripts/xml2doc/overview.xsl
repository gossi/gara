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

	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>Overview</title>
				<link rel="stylesheet" type="text/css" href="garaapi.css" />
				<script type="text/javascript" src="garaapi.js"><xsl:comment><![CDATA[ ]]></xsl:comment></script>
			</head>
			<body>
				<h1>Overview</h1>
				
				<ul>
					<xsl:for-each select="//Flat/Class[not(@namespace=preceding-sibling::Class/@namespace)]/@namespace">
						<xsl:sort select="."/>
					
						<li><tt><a href="#" onclick="selectNamespace('{.}');"><xsl:value-of select="."/></a></tt></li>
					</xsl:for-each>
				</ul>
			</body>
		</html>
	</xsl:template>

</xsl:stylesheet>
