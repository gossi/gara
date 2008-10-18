<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
	version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:exsl="http://exslt.org/common"
	extension-element-prefixes="exsl">

	<xsl:output
		method="xml"
		encoding="UTF-8"
		indent="yes"
		doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"
		doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

	<xsl:import href="lib.xsl"/>
	<xsl:variable name="substr" select="concat(//class/@name, '.')"/>
	<xsl:variable name="canonicalName" select="concat(//class/namespace, '.', //class/@name)"/>

	<xsl:template match="/">
		<xsl:variable name="bFields" select="count(//class/fields/*) &gt; 0 and count(//class/fields/field[@isPrivate = 'false']) &gt; 0"/>
		<xsl:variable name="bMethods" select="count(//class/methods/*) &gt; 0 and count(//class/methods/method[@isPrivate = 'false']) &gt; 0"/>

		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<title>
					<xsl:value-of select="//class/namespace"/>
					<xsl:text>.</xsl:text>
					<xsl:value-of select="//class/@name"/>
				</title>
				<link rel="stylesheet" type="text/css" href="garaapi.css" />
			</head>
			<body>
				<xsl:call-template name="navigation">
					<xsl:with-param name="namespace" select="//class/namespace"/>
				</xsl:call-template>
				<h1><xsl:value-of select="//class/@name"/></h1>
				<pre>
					<xsl:call-template name="ClassTree">
						<xsl:with-param name="canonicalName" select="$canonicalName"/>
					</xsl:call-template>
				</pre>
				<xsl:variable name="namespace">
					<xsl:call-template name="getNamespace">
						<xsl:with-param name="Object" select="'gara.jswt.Widget'"/>
					</xsl:call-template>
				</xsl:variable>
				
				<xsl:variable name="className">
					<xsl:call-template name="getClass">
						<xsl:with-param name="Object" select="'gara.jswt.Widget'"/>
					</xsl:call-template>
				</xsl:variable>

				<hr/>
				<pre>
					<xsl:choose>
						<xsl:when test="//class/@isPrivate = 'true'">private </xsl:when>
						<xsl:otherwise>public </xsl:otherwise>
					</xsl:choose>
					<xsl:text> </xsl:text>
					<strong><xsl:value-of select="//class/@name"/></strong>
					<xsl:if test="//class/extends">
						<xsl:text>&#13;Extends: </xsl:text>
						<xsl:value-of select="//class/extends"/>
					</xsl:if>
				</pre>
				<p><xsl:value-of select="//class/description"/></p>
				<xsl:call-template name="details">
					<xsl:with-param name="Object" select="//class"/>
				</xsl:call-template>
				
				<!-- <h2>Constructor Summary</h2>
				<xsl:call-template name="summary">
					<xsl:with-param name="Objects" select="//class"/>
					<xsl:with-param name="type" select="'constructor'"/>
				</xsl:call-template>-->
				
				<xsl:variable name="fieldSummary">
					<xsl:if test="$bFields">
						<xsl:call-template name="Summary">
							<xsl:with-param name="Objects" select="//class/fields[field/@isPrivate = 'false']"/>
							<xsl:with-param name="type" select="'field'"/>
						</xsl:call-template>
					</xsl:if>
					
					<xsl:call-template name="Inheritance">
						<xsl:with-param name="canonicalName" select="$canonicalName"/>
						<xsl:with-param name="type" select="'field'"/>
					</xsl:call-template>
				</xsl:variable>
				
				<xsl:if test="$fieldSummary != ''">
					<h2>Field Summary</h2>
					<xsl:copy-of select="$fieldSummary"/>
				</xsl:if>
				
				<xsl:variable name="methodSummary">
					<xsl:if test="$bMethods">
						<xsl:call-template name="Summary">
							<xsl:with-param name="Objects" select="//class/methods[method/@isPrivate = 'false']"/>
							<xsl:with-param name="type" select="'method'"/>
						</xsl:call-template>
					</xsl:if>
					
					<xsl:call-template name="Inheritance">
						<xsl:with-param name="canonicalName" select="$canonicalName"/>
						<xsl:with-param name="type" select="'method'"/>
					</xsl:call-template>
				</xsl:variable>
				
				<xsl:if test="$methodSummary != ''">
					<h2>Method Summary</h2>
					<xsl:copy-of select="$methodSummary"/>
				</xsl:if>

				<xsl:if test="$bFields">
					<h2>Field Detail</h2>
					<xsl:for-each select="//class/fields/field[@isPrivate = 'false']">
						<xsl:sort select="@name"/>
						<xsl:variable name="fieldName" select="substring-after(@name, $substr)"/>
						<xsl:variable name="type">
							<xsl:choose>
								<xsl:when test="type">
									<xsl:value-of select="type"/>
								</xsl:when>
								<xsl:otherwise>void</xsl:otherwise>
							</xsl:choose>
						</xsl:variable>

						<h3 id="field_{$fieldName}"><xsl:value-of select="$fieldName"/></h3>
						<pre>
							<xsl:text>public </xsl:text>
							<xsl:call-template name="type">
								<xsl:with-param name="type" select="$type"/>
							</xsl:call-template>
							<xsl:text> </xsl:text> 
							<strong><xsl:value-of select="$fieldName"/></strong>
						</pre>
						<p class="description">
							<xsl:value-of select="description"/>
						</p>
						
						<xsl:call-template name="details">
							<xsl:with-param name="Object" select="."/>
						</xsl:call-template>
						<hr/>
					</xsl:for-each>
				</xsl:if>

				<xsl:if test="$bMethods">
					<h2>Method Detail</h2>
					<xsl:for-each select="//class/methods/method[@isPrivate = 'false']">
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

						<h3 id="method_{$methodName}"><xsl:value-of select="$methodName"/></h3>
						<pre>
							<xsl:text>public </xsl:text>
							<xsl:call-template name="type">
								<xsl:with-param name="type" select="$returnType"/>
							</xsl:call-template>
							<xsl:text> </xsl:text>
							<strong><xsl:value-of select="$methodName"/></strong>
							<xsl:text>(</xsl:text>
							<xsl:for-each select="params/param">
								<xsl:call-template name="type">
									<xsl:with-param name="type" select="@type"/>
								</xsl:call-template>
								<xsl:text> </xsl:text>
								<xsl:value-of select="@name"/>
								<xsl:if test="position() != last()">
									<xsl:text>, </xsl:text>
								</xsl:if>
							</xsl:for-each>
							<xsl:text>)</xsl:text>
						</pre>
						<p class="description">
							<xsl:value-of select="description"/>
						</p>

						<xsl:call-template name="details">
							<xsl:with-param name="Object" select="."/>
						</xsl:call-template>
						<hr/>
					</xsl:for-each>
				</xsl:if>
				<xsl:call-template name="navigation">
					<xsl:with-param name="namespace" select="//class/namespace"/>
				</xsl:call-template>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template name="ClassTree">
		<xsl:param name="canonicalName"/>
		<xsl:variable name="className">
			<xsl:call-template name="getClass">
				<xsl:with-param name="Object" select="$canonicalName"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="namespace">
			<xsl:call-template name="getNamespace">
				<xsl:with-param name="Object" select="$canonicalName"/>
			</xsl:call-template>
		</xsl:variable>
		<xsl:variable name="HierNode" select="$hierarchy//Namespace[@name = $namespace]//class[@name = $className]"/>
		<xsl:variable name="supers" select="number(count($HierNode/ancestor::Class))"/>

		<xsl:if test="$supers &gt; 0">
			<xsl:call-template name="ClassTree">
				<xsl:with-param name="canonicalName" select="concat($namespace, '.', $HierNode/parent::Class/@name)"/>
			</xsl:call-template>
			<xsl:value-of select="'&#13;'"/>
			<xsl:call-template name="Spacer">
				<xsl:with-param name="amount" select="($supers * 4) + ($supers - 1) * 3"/>
			</xsl:call-template>
			<xsl:text>└─ </xsl:text>
		</xsl:if>

		<xsl:call-template name="linkObject">
			<xsl:with-param name="canonicalName" select="$canonicalName"/>
			<xsl:with-param name="useCanonicalName" select="'true'"/>
		</xsl:call-template>
	</xsl:template>
	
	<xsl:template name="Summary">
		<xsl:param name="Objects"/>
		<xsl:param name="type"/>

		<table class="own">
			<tbody>
				<xsl:for-each select="$Objects/*[name() = $type and @isPrivate = 'false']">
					<xsl:sort select="@name"/>
					<xsl:variable name="propName" select="substring-after(@name, $substr)"/>
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
					<tr>
						<td class="returnType">
							<xsl:call-template name="type">
								<xsl:with-param name="type" select="$returnType"/>
							</xsl:call-template>
						</td>
						<td>
							<tt>
								<a href="#{$type}_{$propName}"><xsl:value-of select="$propName"/></a>
								<xsl:if test="params">
									<xsl:text>(</xsl:text>
									<xsl:for-each select="params/param">
										<xsl:call-template name="type">
											<xsl:with-param name="type" select="@type"/>
										</xsl:call-template>
										<xsl:text> </xsl:text>
										<xsl:value-of select="@name"/>
										<xsl:if test="position() != last()">
											<xsl:text>, </xsl:text>
										</xsl:if>
									</xsl:for-each>
									<xsl:text>)</xsl:text>
								</xsl:if>
							</tt>
							<span class="description">
								<xsl:choose>
									<xsl:when test="summary != ''"><xsl:value-of select="summary"/></xsl:when>
									<xsl:otherwise><xsl:value-of select="description"/></xsl:otherwise>
								</xsl:choose>
							</span>
						</td>
					</tr>
				</xsl:for-each>
			</tbody>
		</table>
	</xsl:template>
	
	<xsl:template name="Inheritance">
		<xsl:param name="canonicalName"/>
		<xsl:param name="type"/>
		<xsl:param name="base" select="'none'"/>

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

		<xsl:variable name="HierNode" select="$hierarchy//Namespace[@name = $namespace]//class[@name = $className]"/>
		<xsl:variable name="supers" select="number(count($HierNode/ancestor::Class))"/>
		
		<xsl:if test="$base != 'none'">
			<xsl:variable name="properties">
				<xsl:for-each select="$hierarchy//Class[@name = $className and namespace = $namespace]/*[name() = concat($type, 's')]/*[name() = $type and @isPrivate = 'false']">
					<xsl:variable name="name" select="substring-after(@name, concat($className, '.'))"/>
					
					<xsl:variable name="exists">
						<xsl:call-template name="checkInheritance">
							<xsl:with-param name="canonicalName" select="$base"/>
							<xsl:with-param name="type" select="$type"/>
							<xsl:with-param name="end" select="$canonicalName"/>
							<xsl:with-param name="prop" select="$name"/>
						</xsl:call-template>
					</xsl:variable>

					<xsl:if test="$exists">
						<prop><xsl:value-of select="$name"/></prop>
					</xsl:if>
				</xsl:for-each>
			</xsl:variable>
			
			<xsl:variable name="props" select="exsl:node-set($properties)"/>
	
			<xsl:if test="count($props/*) &gt; 0">
				<table>
					<thead>
						<tr>
							<th>
								<xsl:text>Inherited </xsl:text>
								<xsl:value-of select="concat($type, 's')"/>
								<xsl:text> from </xsl:text>
								<xsl:value-of select="$namespace"/>
								<xsl:text>.</xsl:text>
								<xsl:call-template name="linkObject">
									<xsl:with-param name="canonicalName" select="$canonicalName"/>
								</xsl:call-template>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<tt>
									<xsl:for-each select="$props/*">
										<xsl:variable name="name" select="."/>
										<xsl:variable name="href">
											<xsl:value-of select="concat($namespace, '.', $className, '.')"/>
											<xsl:choose>
												<xsl:when test="$hierarchy//Class[@name = $className and namespace = $namespace and @isInterface = 'true']">interface</xsl:when>
												<xsl:otherwise>class</xsl:otherwise>
											</xsl:choose>
											<xsl:text>.html#</xsl:text>
											<xsl:value-of select="concat($type, '_', $name)"/>
										</xsl:variable>
										<xsl:if test="position() != 1">
											<xsl:text>, </xsl:text>
										</xsl:if>
										<a href="{$href}"><xsl:value-of select="$name"/></a>
									</xsl:for-each>
								</tt>
							</td>
						</tr>
					</tbody>
				</table>
			</xsl:if>
		</xsl:if>

		<xsl:if test="$supers &gt; 0">
			<xsl:variable name="start">
				<xsl:choose>
					<xsl:when test="$base = 'none'"><xsl:value-of select="$canonicalName"/></xsl:when>
					<xsl:otherwise><xsl:value-of select="$base"/></xsl:otherwise>
				</xsl:choose>
			</xsl:variable>
			<xsl:call-template name="Inheritance">
				<xsl:with-param name="canonicalName" select="concat($namespace, '.', $HierNode/parent::Class/@name)"/>
				<xsl:with-param name="type" select="$type"/>
				<xsl:with-param name="base" select="$start"/>
			</xsl:call-template>
		</xsl:if>
	</xsl:template>
	
	<xsl:template name="checkInheritance">
		<xsl:param name="canonicalName"/>
		<xsl:param name="type"/>
		<xsl:param name="prop"/>
		<xsl:param name="end"/>
			
		<xsl:choose>
			<xsl:when test="$canonicalName = $end">
				<xsl:value-of select="true"/>
			</xsl:when>
			<xsl:otherwise>
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

				<xsl:if test="$hierarchy//class[@name = $className and namespace = $namespace]/*[name() = concat($type, 's')]/*[name() = $type and substring-after(concat($namespace, '.'), @name) = $prop]">
					<xsl:value-of select="false"/>
				</xsl:if>

				<xsl:variable name="HierNode" select="$hierarchy//Namespace[@name = $namespace]//class[@name = $className]"/>
				<xsl:call-template name="checkInheritance">
					<xsl:with-param name="canonicalName" select="concat($namespace, '.', $HierNode/parent::Class/@name)"/>
					<xsl:with-param name="type" select="$type"/>
					<xsl:with-param name="end" select="$end"/>
					<xsl:with-param name="prop" select="$prop"/>
				</xsl:call-template>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
