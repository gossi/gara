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

	<xsl:import href="lib.xsl"/>
	<xsl:param name="namespace"/>
	

	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>Class Tree</title>
				<link rel="stylesheet" type="text/css" href="garaapi.css" />
			</head>
			<body>
				<xsl:call-template name="navigation">
					<xsl:with-param name="namespace" select="$namespace"/>
				</xsl:call-template>
				<h1>Class Tree</h1>
				<xsl:text>Namespace: </xsl:text>
				<a href="{concat($namespace, '._namespace.html')}">
					<xsl:value-of select="$namespace"/>
				</a>
				
				<h2>Classes</h2>
				<xsl:for-each select="//Tree/Class[@namespace = $namespace]">
					<ul>
						<li>
							<tt><a href="{concat($namespace, '.', @name, '.class.html')}"><xsl:value-of select="@name"/></a></tt>
						
							<xsl:call-template name="SubClasses">
								<xsl:with-param name="super" select="."/>
							</xsl:call-template>
						</li>
					</ul>
				</xsl:for-each>
				
				<h2>Interfaces</h2>
				<xsl:for-each select="//Tree/Interface[@namespace = $namespace]">
					<ul>
						<li>
							<tt><a href="{concat($namespace, '.', @name, '.class.html')}"><xsl:value-of select="@name"/></a></tt>
						
							<xsl:call-template name="SubInterfaces">
								<xsl:with-param name="super" select="."/>
							</xsl:call-template>
						</li>
					</ul>
				</xsl:for-each>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template name="SubClasses">
		<xsl:param name="super"/>
		<xsl:if test="count($super/Class[@namespace = $namespace]) &gt; 0">
			<ul>
				<xsl:for-each select="$super/Class[@namespace = $namespace]">
					<li>
						<tt>
							<a href="{concat($namespace, '.', @name, '.class.html')}"><xsl:value-of select="@name"/></a>
						</tt>
						<xsl:call-template name="SubClasses">
							<xsl:with-param name="super" select="."/>
						</xsl:call-template>
					</li>
				</xsl:for-each>
			</ul>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="SubInterfaces">
		<xsl:param name="super"/>
		<xsl:if test="count($super/Interface[@namespace = $namespace]) &gt; 0">
			<ul>
				<xsl:for-each select="$super/Interface[@namespace = $namespace]">
					<li>
						<tt>
							<a href="{concat($namespace, '.', @name, '.class.html')}"><xsl:value-of select="@name"/></a>
						</tt>
						<xsl:call-template name="SubInterfaces">
							<xsl:with-param name="super" select="."/>
						</xsl:call-template>
					</li>
				</xsl:for-each>
			</ul>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
