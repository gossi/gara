<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:exsl="http://exslt.org/common"
	extension-element-prefixes="exsl">
	
	<xsl:param name="hierarchyPath"/>
	<xsl:variable name="hierarchy" select="exsl:node-set(document($hierarchyPath))"/>

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

	<!--<xsl:template name="getParent">
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
	</xsl:template>-->
	
	<xsl:template name="details">
		<xsl:param name="Object"/>
		
		<xsl:variable name="info">
			<xsl:if test="count($Object/params/param) &gt; 0">
				<dt>Parameters:</dt>
				
				<xsl:for-each select="$Object/params/param">
					<dd>
						<tt>
							<xsl:call-template name="linkObject">
								<xsl:with-param name="canonicalName" select="@type"/>
							</xsl:call-template>
							<xsl:text> </xsl:text>
							<xsl:value-of select="@name"/>
						</tt> - <xsl:value-of select="description"/>
					</dd>
				</xsl:for-each>
			</xsl:if>
			
			<xsl:if test="count($Object/throws/throw) &gt; 0">
				<dt>Throws:</dt>
				
				<xsl:for-each select="$Object/throws/throw">
					<dd>
						<tt>
							<xsl:call-template name="linkObject">
								<xsl:with-param name="canonicalName" select="@type"/>
							</xsl:call-template>
						</tt> - <xsl:value-of select="description"/>
					</dd>
				</xsl:for-each>
			</xsl:if>

			<xsl:if test="$Object/return != ''">
				<dt>Returns:</dt>

				<dd><xsl:value-of select="$Object/return"/></dd>
			</xsl:if>
			
			<xsl:if test="count($Object/authors/author) &gt; 0">
				<dt>
					<xsl:text>Author</xsl:text>
					<xsl:if test="count($Object/authors/author) &gt; 1">
						<xsl:text>s</xsl:text>
					</xsl:if>
					<xsl:text>:</xsl:text>
				</dt>

				<xsl:for-each select="$Object/authors/author">
					<dd><xsl:value-of select="."/></dd>
				</xsl:for-each>
			</xsl:if>

			<xsl:if test="$Object/since != ''">
				<dt>Since:</dt>

				<dd><xsl:value-of select="$Object/since"/></dd>
			</xsl:if>
			
			<xsl:if test="count($Object/sees/see) &gt; 0">
				<dt>See Also:</dt>
				
				<dd>
					<xsl:for-each select="$Object/sees/see">
						<tt>
							<xsl:variable name="type">
								<xsl:call-template name="type">
									<xsl:with-param name="type" select="."/>
								</xsl:call-template>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="starts-with(., 'http://')">
									<a href="{.}"><xsl:value-of select="."/></a>
								</xsl:when>
								<xsl:when test="$type != .">
									<xsl:copy-of select="$type"/>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="." disable-output-escaping="true"/>
								</xsl:otherwise>
							</xsl:choose>
						</tt>
					</xsl:for-each>
				</dd>
			</xsl:if>

		</xsl:variable>
		
		<xsl:if test="$info != ''">
			<dl><xsl:copy-of select="$info"/></dl>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="linkObject">
		<xsl:param name="canonicalName"/>
		<xsl:param name="useCanonicalName" select="false"/>
		
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
		
		<xsl:variable name="href">
			<xsl:choose>
				<xsl:when test="$hierarchy//Interface[@name = $className and namespace = $namespace]">
					<xsl:value-of select="$namespace"/>
					<xsl:if test="$namespace != ''">
						<xsl:text>.</xsl:text>
					</xsl:if>
					<xsl:value-of select="$className"/>
					<xsl:text>.interface.html</xsl:text>
				</xsl:when>
				<xsl:when test="$hierarchy//Class[@name = $className and namespace = $namespace]">
					<xsl:value-of select="$namespace"/>
					<xsl:if test="$namespace != ''">
						<xsl:text>.</xsl:text>
					</xsl:if>
					<xsl:value-of select="$className"/>
					<xsl:text>.class.html</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="-1"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:variable>

		<xsl:choose>
			<xsl:when test="$href = -1">
				<xsl:value-of select="$canonicalName"/>
			</xsl:when>
			<xsl:otherwise>
				<a href="{$href}">
					<xsl:choose>
						<xsl:when test="$useCanonicalName = true"><xsl:value-of select="$canonicalName"/></xsl:when>
						<xsl:otherwise><xsl:value-of select="$className"/></xsl:otherwise>
					</xsl:choose>
				</a>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="type">
		<xsl:param name="type"/>
		
		<xsl:variable name="cleanType">
			<xsl:choose>
				<xsl:when test="contains($type, '[]')">
					<xsl:value-of select="substring-before($type, '[]')"/>
				</xsl:when>
				<xsl:otherwise><xsl:value-of select="$type"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<xsl:variable name="namespace">
			<xsl:call-template name="getNamespace">
				<xsl:with-param name="Object" select="$cleanType"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="className">
			<xsl:call-template name="getClass">
				<xsl:with-param name="Object" select="$cleanType"/>
			</xsl:call-template>
		</xsl:variable>
		
		<xsl:choose>
			<xsl:when test="$hierarchy//Class[@name = $className and namespace = $namespace] or $hierarchy//Interface[@name = $className and namespace = $namespace]">
				<xsl:call-template name="linkObject">
					<xsl:with-param name="canonicalName" select="concat($namespace, '.', $className)"/>
				</xsl:call-template>
				<xsl:if test="contains($type, '[]')">
					<xsl:text>[]</xsl:text>
				</xsl:if>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$type"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template name="navigation">
		<xsl:param name="namespace"/>
		
		<ul class="nav">
			<li><a href="_overview.html">Overview</a></li>
			<li><a href="{$namespace}._namespace.html">Namespace</a></li>
			<li><a href="{$namespace}._tree.html">Class Tree</a></li>
		</ul>
	</xsl:template>

	<xsl:template name="Spacer">
		<xsl:param name="amount"/>
		
		<xsl:if test="$amount &gt; 0">
			<xsl:text> </xsl:text>
			<xsl:call-template name="Spacer">
				<xsl:with-param name="amount" select="$amount - 1"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
</xsl:stylesheet>
